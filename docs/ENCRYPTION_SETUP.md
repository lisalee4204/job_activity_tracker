# Token Encryption Setup

## Overview

Gmail tokens are now encrypted at rest using AES-256-GCM encryption. This ensures that even if the database is compromised, tokens cannot be read without the encryption key.

## Setup Instructions

### 1. Generate Encryption Key

Generate a secure 32-byte (256-bit) encryption key:

```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Set Encryption Key in Supabase

```bash
supabase secrets set ENCRYPTION_KEY=your-generated-key-here
```

**Important**: 
- Use a strong, random key
- Never commit the key to version control
- Store securely (password manager, secrets manager)
- Rotate periodically (every 6-12 months)

### 3. Verify Encryption

After setting the key, tokens will be automatically encrypted when stored and decrypted when used.

## How It Works

### Encryption Process

1. **Token Received**: Gmail OAuth returns access/refresh tokens
2. **Encrypt**: Tokens encrypted using AES-256-GCM
3. **Store**: Encrypted tokens stored in database
4. **Decrypt**: Tokens decrypted when needed for API calls

### Security Features

- **AES-256-GCM**: Industry-standard encryption
- **Random IV**: Each encryption uses unique initialization vector
- **Key Derivation**: PBKDF2 with 100,000 iterations
- **Authenticated Encryption**: GCM mode provides authentication

## Migration

### Existing Tokens

If you have existing unencrypted tokens:

1. Users will need to reconnect Gmail
2. New tokens will be encrypted automatically
3. Old tokens will be replaced on next refresh

### Testing

To verify encryption is working:

1. Connect Gmail account
2. Check database - tokens should be base64-encoded strings (not plain text)
3. Test email import - should work normally
4. Tokens are decrypted automatically when used

## Key Management

### Best Practices

1. **Rotate Keys**: Change encryption key every 6-12 months
2. **Backup Keys**: Store keys securely (encrypted backup)
3. **Access Control**: Limit who can access encryption keys
4. **Monitoring**: Log key access and rotation events

### Key Rotation Process

1. Generate new encryption key
2. Set new key in Supabase secrets
3. Re-encrypt existing tokens (or require reconnection)
4. Remove old key after verification

## Troubleshooting

### "Failed to decrypt token"

- Check encryption key is set correctly
- Verify key hasn't changed
- User may need to reconnect Gmail

### "Failed to encrypt token"

- Check encryption key is set
- Verify key format (base64, 32 bytes)
- Check Deno crypto API availability

## Compliance

This encryption method meets:
- **GDPR**: Personal data protection
- **SOC 2**: Data security requirements
- **HIPAA**: Healthcare data protection (if applicable)

## Future Improvements

- [ ] Key rotation automation
- [ ] Hardware Security Module (HSM) integration
- [ ] Multi-key support for key rotation
- [ ] Encryption key audit logging







