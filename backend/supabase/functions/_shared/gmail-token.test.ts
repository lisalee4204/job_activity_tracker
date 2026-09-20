/**
 * Regression tests for the Gmail token refresh.
 *
 * The bug these guard against: tokens are stored encrypted, but a copy of the
 * refresh logic sent the stored ciphertext straight to Google and wrote the
 * new tokens back in plaintext. Google answered 400 invalid_grant, the next
 * read failed to decrypt, and Gmail import broke roughly an hour after every
 * connection with nothing but "please reconnect Gmail" to show for it.
 *
 * Run: deno test --allow-env _shared/gmail-token.test.ts
 */

import { assert, assertEquals, assertRejects } from 'jsr:@std/assert@1'
import { decryptToken, encryptToken } from './encryption.ts'
import { refreshGmailToken } from './gmail-token.ts'

Deno.env.set('ENCRYPTION_KEY', 'test-key-for-unit-tests-32-chars!')
Deno.env.set('GMAIL_CLIENT_ID', 'test-client-id')
Deno.env.set('GMAIL_CLIENT_SECRET', 'test-client-secret')

const USER_ID = 'user-123'

/** Minimal stand-in for the supabase client, recording what gets written. */
function makeSupabaseStub(storedRow: Record<string, unknown> | null) {
  const writes: Record<string, unknown>[] = []

  const client = {
    from() {
      return {
        select() {
          return {
            eq() {
              return {
                maybeSingle: () =>
                  Promise.resolve({
                    data: storedRow,
                    error: storedRow ? null : null,
                  }),
              }
            },
          }
        },
        update(values: Record<string, unknown>) {
          writes.push(values)
          return { eq: () => Promise.resolve({ error: null }) }
        },
      }
    },
  }

  return { client, writes }
}

/** Swap global fetch for the duration of one test. */
async function withFetch(
  handler: (url: string, init: RequestInit) => Response,
  run: () => Promise<void>,
) {
  const original = globalThis.fetch
  globalThis.fetch = ((url: string, init: RequestInit) =>
    Promise.resolve(handler(url, init))) as unknown as typeof fetch
  try {
    await run()
  } finally {
    globalThis.fetch = original
  }
}

Deno.test('encryption round-trips a token', async () => {
  const encrypted = await encryptToken('plaintext-token')
  assert(encrypted !== 'plaintext-token', 'token was stored in the clear')
  assertEquals(await decryptToken(encrypted), 'plaintext-token')
})

Deno.test('Google receives the decrypted refresh token, not the ciphertext', async () => {
  const storedRefresh = await encryptToken('real-refresh-token')
  const { client } = makeSupabaseStub({
    user_id: USER_ID,
    access_token: await encryptToken('old-access-token'),
    refresh_token: storedRefresh,
  })

  let sentRefreshToken: string | null = null

  await withFetch(
    (_url, init) => {
      sentRefreshToken = new URLSearchParams(init.body as string).get('refresh_token')
      return new Response(
        JSON.stringify({ access_token: 'new-access-token', expires_in: 3600 }),
        { status: 200 },
      )
    },
    async () => {
      await refreshGmailToken(client, USER_ID)
    },
  )

  assertEquals(sentRefreshToken, 'real-refresh-token')
  assert(sentRefreshToken !== storedRefresh, 'sent the stored ciphertext to Google')
})

Deno.test('tokens are written back encrypted, and read back correctly', async () => {
  const { client, writes } = makeSupabaseStub({
    user_id: USER_ID,
    access_token: await encryptToken('old-access-token'),
    refresh_token: await encryptToken('real-refresh-token'),
  })

  await withFetch(
    () =>
      new Response(
        JSON.stringify({
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
          expires_in: 3600,
        }),
        { status: 200 },
      ),
    async () => {
      const result = await refreshGmailToken(client, USER_ID)
      // The caller gets plaintext to use immediately...
      assertEquals(result.access_token, 'new-access-token')
    },
  )

  assertEquals(writes.length, 1)
  const written = writes[0]

  // ...but only ciphertext is persisted.
  assert(written.access_token !== 'new-access-token', 'access token persisted in the clear')
  assert(written.refresh_token !== 'new-refresh-token', 'refresh token persisted in the clear')

  // And the next read can actually decrypt what we stored.
  assertEquals(await decryptToken(written.access_token as string), 'new-access-token')
  assertEquals(await decryptToken(written.refresh_token as string), 'new-refresh-token')
})

Deno.test('an existing refresh token is kept when Google omits one', async () => {
  const storedRefresh = await encryptToken('real-refresh-token')
  const { client, writes } = makeSupabaseStub({
    user_id: USER_ID,
    access_token: await encryptToken('old-access-token'),
    refresh_token: storedRefresh,
  })

  await withFetch(
    () =>
      new Response(JSON.stringify({ access_token: 'new-access-token', expires_in: 3600 }), {
        status: 200,
      }),
    async () => {
      await refreshGmailToken(client, USER_ID)
    },
  )

  // Unchanged, and still decryptable — not double-encrypted.
  assertEquals(writes[0].refresh_token, storedRefresh)
  assertEquals(await decryptToken(writes[0].refresh_token as string), 'real-refresh-token')
})

Deno.test('a revoked refresh token asks the user to reconnect', async () => {
  const { client } = makeSupabaseStub({
    user_id: USER_ID,
    access_token: await encryptToken('old-access-token'),
    refresh_token: await encryptToken('revoked-token'),
  })

  await withFetch(
    () => new Response('{"error":"invalid_grant"}', { status: 400 }),
    async () => {
      await assertRejects(
        () => refreshGmailToken(client, USER_ID),
        Error,
        'Please reconnect Gmail',
      )
    },
  )
})

Deno.test('a missing Gmail connection is reported as such', async () => {
  const { client } = makeSupabaseStub(null)
  await assertRejects(() => refreshGmailToken(client, USER_ID), Error, 'Gmail not connected')
})
