// Job Application Tracker (Demo) - zero backend.
// Data persistence: localStorage. Export/Import JSON for portability.

const STORAGE_KEY = "job_tracker_data_v1";

const DEMO = {
  "applications": [
    {
      "company": "Google",
      "role": "Product Analyst",
      "date_applied": "2026-01-10",
      "source": "LinkedIn",
      "status": "Applied",
      "priority": "High",
      "location": "Remote",
      "contact": "",
      "next_step": "Follow up email",
      "next_step_date": "2026-02-05",
      "notes": ""
    },
    {
      "company": "Amazon",
      "role": "Program Manager",
      "date_applied": "2026-01-12",
      "source": "Company site",
      "status": "Interview",
      "priority": "High",
      "location": "Dallas, TX",
      "contact": "Recruiter",
      "next_step": "Panel interview",
      "next_step_date": "2026-02-06",
      "notes": "Prep STAR stories"
    },
    {
      "company": "Netflix",
      "role": "Customer Insights Manager",
      "date_applied": "2026-01-08",
      "source": "Referral",
      "status": "Rejected",
      "priority": "Medium",
      "location": "Remote",
      "contact": "",
      "next_step": "",
      "next_step_date": "",
      "notes": "Reapply later"
    },
    {
      "company": "Toyota",
      "role": "Data Analysis Manager",
      "date_applied": "2026-01-15",
      "source": "Company site",
      "status": "Offer",
      "priority": "High",
      "location": "Plano, TX",
      "contact": "Hiring Manager",
      "next_step": "Negotiate",
      "next_step_date": "2026-02-07",
      "notes": "Ask about bonus"
    },
    {
      "company": "Equinix",
      "role": "Strategy Manager",
      "date_applied": "2026-01-20",
      "source": "LinkedIn",
      "status": "Interview",
      "priority": "Medium",
      "location": "Frisco, TX",
      "contact": "Recruiter",
      "next_step": "Case interview",
      "next_step_date": "2026-02-08",
      "notes": ""
    },
    {
      "company": "McKesson",
      "role": "Analytics Manager",
      "date_applied": "2026-01-22",
      "source": "LinkedIn",
      "status": "Applied",
      "priority": "Low",
      "location": "Irving, TX",
      "contact": "",
      "next_step": "",
      "next_step_date": "",
      "notes": ""
    }
  ],
  "interviews": [
    {
      "company": "Amazon",
      "role": "Program Manager",
      "stage": "Phone Screen",
      "date": "2026-01-25",
      "result": "Pass",
      "notes": ""
    },
    {
      "company": "Equinix",
      "role": "Strategy Manager",
      "stage": "Panel",
      "date": "2026-01-29",
      "result": "Pending",
      "notes": ""
    },
    {
      "company": "Toyota",
      "role": "Data Analysis Manager",
      "stage": "Final",
      "date": "2026-02-01",
      "result": "Offer",
      "notes": "Offer received"
    }
  ],
  "offers": [
    {
      "company": "Toyota",
      "role": "Data Analysis Manager",
      "salary": 145000,
      "bonus": 15000,
      "equity": 0,
      "location": "Plano, TX",
      "decision_deadline": "2026-02-10",
      "status": "Open",
      "notes": "Negotiating PTO"
    }
  ]
};

function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch { /* ignore */ }
  }
  return structuredClone(DEMO);
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function fmtMoney(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "";
  return num.toLocaleString(undefined, {style:"currency", currency:"USD", maximumFractionDigits:0});
}

function parseMoney(s) {
  if (s == null) return 0;
  const cleaned = String(s).replace(/[^0-9.-]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function el(id){ return document.getElementById(id); }

let statusChart, offerChart;

function computeKPIs(data) {
  const applied = data.applications.length;
  const interviews = data.interviews.length;
  const offers = data.applications.filter(a => a.status === "Offer").length;
  const rejected = data.applications.filter(a => a.status === "Rejected").length;
  el("kpiApplied").textContent = applied;
  el("kpiInterviews").textContent = interviews;
  el("kpiOffers").textContent = offers;
  el("kpiRejected").textContent = rejected;
}

function statusCounts(data) {
  const counts = {Applied:0, Interview:0, Rejected:0, Offer:0};
  for (const a of data.applications) {
    if (counts[a.status] != null) counts[a.status] += 1;
  }
  return counts;
}

function renderStatusChart(data) {
  const ctx = el("statusChart").getContext("2d");
  const counts = statusCounts(data);
  const labels = Object.keys(counts);
  const values = labels.map(k => counts[k]);

  if (statusChart) statusChart.destroy();
  statusChart = new Chart(ctx, {
    type: "doughnut",
    data: { labels, datasets: [{ data: values }] },
    options: {
      plugins: { legend: { position: "bottom", labels: { color: "#e8eefc" } } },
      cutout: "65%"
    }
  });
}

function renderOfferChart(data) {
  const ctx = el("offerChart").getContext("2d");
  const labels = data.offers.map(o => o.company);
  const values = data.offers.map(o => Number(o.salary) || 0);

  if (offerChart) offerChart.destroy();
  offerChart = new Chart(ctx, {
    type: "bar",
    data: { labels, datasets: [{ label: "Salary", data: values }] },
    options: {
      plugins: { legend: { labels: { color: "#e8eefc" } } },
      scales: {
        x: { ticks: { color: "#e8eefc" }, grid: { color: "rgba(255,255,255,.08)" } },
        y: { ticks: { color: "#e8eefc" }, grid: { color: "rgba(255,255,255,.08)" } }
      }
    }
  });
}

function badge(status){
  return `<span class="badge ${status}">${status}</span>`;
}

function buildTable(tableEl, columns, rows, onChangeRow, addRowFn, formatters = {}) {
  tableEl.innerHTML = "";
  const thead = document.createElement("thead");
  const trh = document.createElement("tr");
  for (const col of columns) {
    const th = document.createElement("th");
    th.textContent = col.label;
    trh.appendChild(th);
  }
  const thDel = document.createElement("th");
  thDel.textContent = "";
  trh.appendChild(thDel);
  thead.appendChild(trh);

  const tbody = document.createElement("tbody");

  rows.forEach((row, idx) => {
    const tr = document.createElement("tr");
    columns.forEach(col => {
      const td = document.createElement("td");
      if (col.key === "__statusBadge") {
        td.innerHTML = badge(row.status || "");
        tr.appendChild(td);
        return;
      }
      td.contentEditable = col.editable !== false;
      const val = row[col.key] ?? "";
      td.textContent = formatters[col.key] ? formatters[col.key](val) : val;

      td.addEventListener("blur", () => {
        const raw = td.textContent.trim();
        const next = {...row};

        if (formatters.__parse && formatters.__parse[col.key]) {
          next[col.key] = formatters.__parse[col.key](raw);
        } else {
          next[col.key] = raw;
        }

        onChangeRow(idx, next);
      });

      tr.appendChild(td);
    });

    const tdX = document.createElement("td");
    tdX.innerHTML = `<button class="btn secondary small" data-del="${idx}">Delete</button>`;
    tdX.querySelector("button").addEventListener("click", () => {
      onChangeRow(idx, null, true);
    });
    tr.appendChild(tdX);

    tbody.appendChild(tr);
  });

  tableEl.appendChild(thead);
  tableEl.appendChild(tbody);

  addRowFn && addRowFn();
}

function refresh(data) {
  computeKPIs(data);
  renderStatusChart(data);
  renderOfferChart(data);

  // Applications table
  const appCols = [
    {label:"Company", key:"company"},
    {label:"Role", key:"role"},
    {label:"Date Applied", key:"date_applied"},
    {label:"Source", key:"source"},
    {label:"Status", key:"status"},
    {label:"", key:"__statusBadge", editable:false},
    {label:"Priority", key:"priority"},
    {label:"Location", key:"location"},
    {label:"Contact", key:"contact"},
    {label:"Next Step", key:"next_step"},
    {label:"Next Step Date", key:"next_step_date"},
    {label:"Notes", key:"notes"},
  ];

  buildTable(el("appsTable"), appCols, data.applications,
    (idx, next, isDelete=false) => {
      if (isDelete) data.applications.splice(idx,1);
      else data.applications[idx] = next;
      saveData(data);
      refresh(data);
    }
  );

  // Interviews table
  const intCols = [
    {label:"Company", key:"company"},
    {label:"Role", key:"role"},
    {label:"Stage", key:"stage"},
    {label:"Date", key:"date"},
    {label:"Result", key:"result"},
    {label:"Notes", key:"notes"},
  ];

  buildTable(el("interviewsTable"), intCols, data.interviews,
    (idx, next, isDelete=false) => {
      if (isDelete) data.interviews.splice(idx,1);
      else data.interviews[idx] = next;
      saveData(data);
      refresh(data);
    }
  );

  // Offers table
  const offerCols = [
    {label:"Company", key:"company"},
    {label:"Role", key:"role"},
    {label:"Salary", key:"salary"},
    {label:"Bonus", key:"bonus"},
    {label:"Equity", key:"equity"},
    {label:"Location", key:"location"},
    {label:"Decision Deadline", key:"decision_deadline"},
    {label:"Status", key:"status"},
    {label:"Notes", key:"notes"},
  ];

  const formatters = {
    salary: (v) => fmtMoney(v),
    bonus: (v) => fmtMoney(v),
    __parse: {
      salary: (s) => parseMoney(s),
      bonus: (s) => parseMoney(s),
      equity: (s) => parseMoney(s),
    }
  };

  buildTable(el("offersTable"), offerCols, data.offers,
    (idx, next, isDelete=false) => {
      if (isDelete) data.offers.splice(idx,1);
      else data.offers[idx] = next;
      saveData(data);
      refresh(data);
    },
    null,
    formatters
  );
}

function addRowButtons(data){
  el("addAppBtn").addEventListener("click", () => {
    data.applications.unshift({
      company:"", role:"", date_applied:"", source:"", status:"Applied",
      priority:"Medium", location:"", contact:"", next_step:"", next_step_date:"", notes:""
    });
    saveData(data); refresh(data);
  });

  el("addInterviewBtn").addEventListener("click", () => {
    data.interviews.unshift({company:"", role:"", stage:"", date:"", result:"Pending", notes:""});
    saveData(data); refresh(data);
  });

  el("addOfferBtn").addEventListener("click", () => {
    data.offers.unshift({
      company:"", role:"", salary:0, bonus:0, equity:0, location:"",
      decision_deadline:"", status:"Open", notes:""
    });
    saveData(data); refresh(data);
  });

  el("resetBtn").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = structuredClone(DEMO);
    saveData(fresh);
    refresh(fresh);
  });

  el("exportBtn").addEventListener("click", () => {
    const payload = JSON.stringify(data, null, 2);
    const blob = new Blob([payload], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "job-tracker-data.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  el("importFile").addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      // Minimal validation
      if (!parsed.applications || !parsed.interviews || !parsed.offers) throw new Error("Invalid format");
      saveData(parsed);
      refresh(parsed);
    } catch (err) {
      alert("Could not import that JSON. Make sure it was exported from this tracker.");
    } finally {
      e.target.value = "";
    }
  });
}

(function init(){
  // Inject demo JSON into the file at build-time.
  window.__DEMO__ = window.__DEMO__ || {};
})();

// Bootstrap
const data = loadData();
saveData(data);
addRowButtons(data);
refresh(data);
