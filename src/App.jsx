import React, { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_6if8pl1";
const EMAILJS_TEMPLATE_ID = "template_zccybri";
const EMAILJS_PUBLIC_KEY = "hJBgQyChQ8C0tKcQ3";
const EMAIL_TO = "jlenz@dexiosmfg.com";

const equipmentList = [
  {
    id: "D10008",
    name: "Flo Master",
    type: "Filler",
    buildGuideLink:
      "https://yourcompany.sharepoint.com/sites/YourSite/Shared%20Documents/Flo-Master-D10008-Build-Guide.pdf",
    buildSteps: [
      "Pre-Assembly Check",
      "Pump / Product Path Setup",
      "Hose and Fitting Check",
      "Final Inspection",
      "Sign-Off",
    ],
  },
  {
    id: "D10278",
    name: "REB",
    type: "Filler",
    buildGuideLink:
      "https://dexiosmfg-my.sharepoint.com/:w:/p/jlenz/IQBJ9gDNeY92SqwXNaiPcJnoAf2Sh5sVOyFbZYkdeB65560?e=oEr4U8",
    buildSteps: [
      "Cylinder Assembly",
      "Valve Housing",
      "Shaft Section",
      "Final Inspection",
      "Sign-Off",
    ],
  },
  {
    id: "D10290",
    name: "REB",
    type: "Filler",
    buildGuideLink:
      "https://dexiosmfg-my.sharepoint.com/:w:/p/jlenz/IQBJ9gDNeY92SqwXNaiPcJnoAf2Sh5sVOyFbZYkdeB65560?e=oEr4U8",
    buildSteps: [
      "Cylinder Assembly",
      "Valve Housing",
      "Shaft Section",
      "Final Inspection",
      "Sign-Off",
    ],
  },
  {
    id: "D10110",
    name: "Stickpump",
    type: "Pump",
    buildGuideLink:
      "https://yourcompany.sharepoint.com/sites/YourSite/Shared%20Documents/Stickpump-D10110-Build-Guide.pdf",
    buildSteps: [
      "Pump Body Setup",
      "Hose and Clamp Check",
      "Connection Check",
      "Final Inspection",
      "Sign-Off",
    ],
  },
  {
    id: "D10301",
    name: "Stickpump Saniforce",
    type: "Pump",
    buildGuideLink:
      "https://yourcompany.sharepoint.com/sites/YourSite/Shared%20Documents/Stickpump-Saniforce-D10301-Build-Guide.pdf",
    buildSteps: [
      "Pump Body Setup",
      "Sanitary Fitting Check",
      "Connection Check",
      "Final Inspection",
      "Sign-Off",
    ],
  },
  {
    id: "D10097",
    name: "Diaphragm Pump",
    type: "Pump",
    buildGuideLink:
      "https://yourcompany.sharepoint.com/sites/YourSite/Shared%20Documents/Diaphragm-Pump-D10097-Build-Guide.pdf",
    buildSteps: [
      "Pump Body Setup",
      "Air Line Check",
      "Diaphragm / Seal Check",
      "Final Inspection",
      "Sign-Off",
    ],
  },
  {
    id: "D10068",
    name: "Kentex Tube Filler",
    type: "Tube Filler",
    buildGuideLink:
      "https://yourcompany.sharepoint.com/sites/YourSite/Shared%20Documents/Kentex-Tube-Filler-D10068-Build-Guide.pdf",
    buildSteps: [
      "Machine Setup",
      "Nozzle Setup",
      "Seal Check",
      "Trim Check",
      "Final Inspection",
    ],
  },
];

function getTimestamp() {
  return new Date().toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildEmailSubject(record) {
  return `Equipment ${record.recordType} Submitted - ${record.equipmentName}`;
}

function buildEmailBody(record) {
  return [
    `A ${record.recordType.toLowerCase()} record has been submitted.`,
    "",
    `Record Type: ${record.recordType}`,
    `Equipment ID: ${record.equipmentId}`,
    `Equipment Name: ${record.equipmentName}`,
    `Initials: ${record.initials}`,
    `Date/Time: ${record.timestamp}`,
    record.status ? `Status: ${record.status}` : null,
    record.completedSteps
      ? `Completed Steps: ${record.completedSteps.join(", ") || "None checked"}`
      : null,
    record.buildGuideLink ? `Build Guide: ${record.buildGuideLink}` : null,
    `Notes: ${record.notes || "N/A"}`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendEmailWithEmailJS(record) {
  const templateParams = {
    to_email: EMAIL_TO,
    subject: buildEmailSubject(record),
    message: buildEmailBody(record),
    record_type: record.recordType,
    equipment_id: record.equipmentId,
    equipment_name: record.equipmentName,
    initials: record.initials,
    submitted_at: record.timestamp,
    status: record.status || "N/A",
    completed_steps: record.completedSteps
      ? record.completedSteps.join(", ") || "None checked"
      : "N/A",
    build_guide_link: record.buildGuideLink || "N/A",
    notes: record.notes || "N/A",
  };

  await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, {
    publicKey: EMAILJS_PUBLIC_KEY,
    limitRate: { id: "equipment-tracker-submit", throttle: 1000 },
  });

  return { ok: true, message: "Email sent successfully." };
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [records, setRecords] = useState([]);

  function addRecord(record) {
    setRecords((prev) => [record, ...prev]);
  }

  return (
    <>
      <style>{globalCss}</style>
      <div className="page">
        {screen === "home" && (
          <HomeScreen records={records} setScreen={setScreen} />
        )}
        {screen === "clean" && (
          <CleaningScreen goHome={() => setScreen("home")} addRecord={addRecord} />
        )}
        {screen === "build" && (
          <BuildScreen goHome={() => setScreen("home")} addRecord={addRecord} />
        )}
      </div>
    </>
  );
}

function HomeScreen({ records, setScreen }) {
  return (
    <div className="screen">
      <header className="app-header">
        <p className="app-kicker">Dexios Mfg</p>
        <h1 className="app-title">Equipment Tracker</h1>
      </header>

      <div className="action-grid">
        <button className="action-card action-card--clean" onClick={() => setScreen("clean")}>
          <span className="action-icon" aria-hidden="true">🧹</span>
          <span className="action-label">Log Cleaning</span>
        </button>
        <button className="action-card action-card--build" onClick={() => setScreen("build")}>
          <span className="action-icon" aria-hidden="true">🔧</span>
          <span className="action-label">Log Build</span>
        </button>
      </div>

      <section className="card" aria-label="Recent submissions">
        <h2 className="section-heading">Recent</h2>
        {records.length === 0 ? (
          <p className="muted">No submissions yet.</p>
        ) : (
          <ul className="record-list" role="list">
            {records.slice(0, 10).map((record, i) => (
              <li key={i} className={`record-item record-item--${record.recordType.toLowerCase()}`}>
                <div className="record-badge">
                  {record.recordType === "Cleaning" ? "🧹" : "🔧"}
                </div>
                <div className="record-body">
                  <span className="record-name">{record.equipmentName}</span>
                  <span className="record-meta">{record.equipmentId} · {record.initials}</span>
                  {record.status && record.status !== "Complete" && (
                    <span className="record-status">{record.status}</span>
                  )}
                </div>
                <span className="record-time">{record.timestamp}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function CleaningScreen({ goHome, addRecord }) {
  const [equipmentId, setEquipmentId] = useState(equipmentList[0].id);
  const [initials, setInitials] = useState("");
  const [notes, setNotes] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedRecord, setSubmittedRecord] = useState(null);

  const selectedEquipment = equipmentList.find((e) => e.id === equipmentId);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!initials.trim()) {
      alert("Please enter your initials before submitting.");
      return;
    }

    const record = {
      recordType: "Cleaning",
      equipmentId: selectedEquipment.id,
      equipmentName: selectedEquipment.name,
      initials: initials.trim().toUpperCase(),
      notes: notes.trim(),
      timestamp: getTimestamp(),
    };

    setState("sending");
    try {
      await sendEmailWithEmailJS(record);
      addRecord(record);
      setSubmittedRecord(record);
      setState("success");
      setInitials("");
      setNotes("");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Email failed. Check your connection and try again.");
      setState("error");
    }
  }

  if (state === "success" && submittedRecord) {
    return (
      <div className="screen">
        <SuccessBanner
          record={submittedRecord}
          onAnother={() => { setState("idle"); setSubmittedRecord(null); }}
          onHome={goHome}
        />
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="form-header">
        <button className="back-btn" onClick={goHome} aria-label="Back to home">
          ← Back
        </button>
        <h1 className="form-title">Log Cleaning</h1>
      </div>

      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <Field label="Equipment">
          <select
            className="input"
            value={equipmentId}
            onChange={(e) => setEquipmentId(e.target.value)}
            aria-label="Select equipment"
          >
            {equipmentList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} — {item.id}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Your Initials">
          <input
            className="input input--initials"
            value={initials}
            maxLength={5}
            placeholder="e.g. JL"
            autoCapitalize="characters"
            autoComplete="off"
            onChange={(e) => setInitials(e.target.value)}
            aria-label="Your initials"
          />
        </Field>

        <Field label="Notes (optional)">
          <textarea
            className="input textarea"
            value={notes}
            placeholder="Lot number, condition, issue found…"
            onChange={(e) => setNotes(e.target.value)}
            aria-label="Notes"
          />
        </Field>

        {state === "error" && (
          <p className="error-msg" role="alert">{errorMsg}</p>
        )}

        <button
          className="submit-btn"
          type="submit"
          disabled={state === "sending"}
          aria-busy={state === "sending"}
        >
          {state === "sending" ? "Sending…" : "Submit Cleaning Record"}
        </button>
      </form>
    </div>
  );
}

function BuildScreen({ goHome, addRecord }) {
  const [equipmentId, setEquipmentId] = useState(equipmentList[0].id);
  const [initials, setInitials] = useState("");
  const [status, setStatus] = useState("Complete");
  const [notes, setNotes] = useState("");
  const [checkedSteps, setCheckedSteps] = useState({});
  const [state, setState] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedRecord, setSubmittedRecord] = useState(null);

  const selectedEquipment = equipmentList.find((e) => e.id === equipmentId);

  const completedCount = useMemo(
    () => selectedEquipment.buildSteps.filter((s) => checkedSteps[s]).length,
    [checkedSteps, selectedEquipment]
  );
  const totalSteps = selectedEquipment.buildSteps.length;
  const allChecked = completedCount === totalSteps;

  function handleEquipmentChange(e) {
    setEquipmentId(e.target.value);
    setCheckedSteps({});
    setSubmittedRecord(null);
    setState("idle");
  }

  function toggleStep(step) {
    setCheckedSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!initials.trim()) {
      alert("Please enter your initials before submitting.");
      return;
    }

    const completedSteps = selectedEquipment.buildSteps.filter((s) => checkedSteps[s]);
    const record = {
      recordType: "Build",
      equipmentId: selectedEquipment.id,
      equipmentName: selectedEquipment.name,
      initials: initials.trim().toUpperCase(),
      status,
      notes: notes.trim(),
      completedSteps,
      buildGuideLink: selectedEquipment.buildGuideLink,
      timestamp: getTimestamp(),
    };

    setState("sending");
    try {
      await sendEmailWithEmailJS(record);
      addRecord(record);
      setSubmittedRecord(record);
      setState("success");
      setInitials("");
      setNotes("");
      setCheckedSteps({});
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Email failed. Check your connection and try again.");
      setState("error");
    }
  }

  if (state === "success" && submittedRecord) {
    return (
      <div className="screen">
        <SuccessBanner
          record={submittedRecord}
          onAnother={() => { setState("idle"); setSubmittedRecord(null); }}
          onHome={goHome}
        />
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="form-header">
        <button className="back-btn" onClick={goHome} aria-label="Back to home">
          ← Back
        </button>
        <h1 className="form-title">Log Build</h1>
      </div>

      <form className="card form-card" onSubmit={handleSubmit} noValidate>
        <Field label="Equipment">
          <select
            className="input"
            value={equipmentId}
            onChange={handleEquipmentChange}
            aria-label="Select equipment"
          >
            {equipmentList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} — {item.id}
              </option>
            ))}
          </select>
        </Field>

        <a
          href={selectedEquipment.buildGuideLink}
          target="_blank"
          rel="noreferrer"
          className="guide-link"
          aria-label={`Open build guide for ${selectedEquipment.name}`}
        >
          <span>📄 Open Build Guide</span>
          <span className="guide-arrow">↗</span>
        </a>

        <Field label={`Build Checklist — ${completedCount} / ${totalSteps}`}>
          <div className="checklist" role="group" aria-label="Build checklist">
            {selectedEquipment.buildSteps.map((step) => (
              <label
                key={step}
                className={`check-row ${checkedSteps[step] ? "check-row--checked" : ""}`}
              >
                <span className={`check-box ${checkedSteps[step] ? "check-box--checked" : ""}`} aria-hidden="true">
                  {checkedSteps[step] ? "✓" : ""}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={Boolean(checkedSteps[step])}
                  onChange={() => toggleStep(step)}
                />
                <span className="check-label">{step}</span>
              </label>
            ))}
            <div className="progress-bar-wrap" role="progressbar" aria-valuenow={completedCount} aria-valuemax={totalSteps}>
              <div className="progress-bar" style={{ width: `${(completedCount / totalSteps) * 100}%` }} />
            </div>
          </div>
        </Field>

        <Field label="Your Initials">
          <input
            className="input input--initials"
            value={initials}
            maxLength={5}
            placeholder="e.g. JL"
            autoCapitalize="characters"
            autoComplete="off"
            onChange={(e) => setInitials(e.target.value)}
            aria-label="Your initials"
          />
        </Field>

        <Field label="Build Status">
          <div className="status-group" role="group" aria-label="Build status">
            {["Complete", "Issue Found", "Needs Supervisor Review"].map((opt) => (
              <label
                key={opt}
                className={`status-option ${status === opt ? "status-option--active" : ""} ${
                  opt === "Issue Found" ? "status-option--warn" : ""
                } ${opt === "Needs Supervisor Review" ? "status-option--alert" : ""}`}
              >
                <input
                  type="radio"
                  name="status"
                  value={opt}
                  className="sr-only"
                  checked={status === opt}
                  onChange={() => setStatus(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </Field>

        <Field label="Notes (optional)">
          <textarea
            className="input textarea"
            value={notes}
            placeholder="Missing parts, issue found, observations…"
            onChange={(e) => setNotes(e.target.value)}
            aria-label="Notes"
          />
        </Field>

        {state === "error" && (
          <p className="error-msg" role="alert">{errorMsg}</p>
        )}

        <button
          className="submit-btn"
          type="submit"
          disabled={state === "sending"}
          aria-busy={state === "sending"}
        >
          {state === "sending" ? "Sending…" : "Submit Build Record"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      {children}
    </div>
  );
}

function SuccessBanner({ record, onAnother, onHome }) {
  return (
    <div className="success-screen">
      <div className="success-icon" aria-hidden="true">✓</div>
      <h2 className="success-heading">Submitted!</h2>
      <p className="success-sub">
        {record.recordType} record for <strong>{record.equipmentName}</strong> sent to {EMAIL_TO}.
      </p>

      <div className="success-detail card">
        <Row label="Type" value={record.recordType} />
        <Row label="Equipment" value={`${record.equipmentName} (${record.equipmentId})`} />
        <Row label="Initials" value={record.initials} />
        <Row label="Time" value={record.timestamp} />
        {record.status && <Row label="Status" value={record.status} />}
        {record.completedSteps && (
          <Row
            label="Steps Done"
            value={
              record.completedSteps.length > 0
                ? record.completedSteps.join(", ")
                : "None checked"
            }
          />
        )}
        {record.notes && <Row label="Notes" value={record.notes} />}
      </div>

      <div className="success-actions">
        <button className="submit-btn" onClick={onAnother}>
          Submit Another
        </button>
        <button className="back-btn back-btn--lg" onClick={onHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );
}

const globalCss = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green:        #8cc63f;
    --green-dark:   #5a8a1a;
    --green-soft:   #eef8dc;
    --charcoal:     #2c3030;
    --charcoal-mid: #4a5050;
    --gray:         #7a8480;
    --border:       #d6dbd8;
    --bg:           #f2f4f2;
    --white:        #ffffff;
    --warn:         #e07b00;
    --alert:        #c0392b;
    --radius-sm:    10px;
    --radius-md:    16px;
    --radius-lg:    22px;
    --font: Gotham, Montserrat, Inter, "Segoe UI", system-ui, sans-serif;
  }

  html, body {
    background: var(--bg);
    color: var(--charcoal);
    font-family: var(--font);
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    min-height: 100dvh;
  }

  /* --- Layout --- */
  .page {
    min-height: 100dvh;
    padding: 0 0 env(safe-area-inset-bottom, 16px);
  }

  .screen {
    max-width: 600px;
    margin: 0 auto;
    padding: 16px 16px 40px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* --- Header --- */
  .app-header {
    background: var(--charcoal);
    color: var(--white);
    border-radius: var(--radius-lg);
    padding: 24px 20px;
    margin-bottom: 4px;
  }
  .app-kicker {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--green);
    margin-bottom: 6px;
  }
  .app-title {
    font-size: 28px;
    font-weight: 900;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    line-height: 1.1;
  }

  /* --- Action Cards (home) --- */
  .action-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .action-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 28px 12px;
    border-radius: var(--radius-lg);
    border: 2px solid var(--border);
    background: var(--white);
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s;
    -webkit-tap-highlight-color: transparent;
    min-height: 130px;
  }
  .action-card:active {
    transform: scale(0.97);
    box-shadow: none;
  }
  .action-card--clean { border-color: #b0d87a; }
  .action-card--build { border-color: #aac4d8; }
  .action-icon { font-size: 36px; line-height: 1; }
  .action-label {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--charcoal);
  }

  /* --- Card --- */
  .card {
    background: var(--white);
    border-radius: var(--radius-lg);
    padding: 18px;
    border: 1px solid var(--border);
  }

  /* --- Section heading --- */
  .section-heading {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--gray);
    margin-bottom: 12px;
  }

  /* --- Record list --- */
  .record-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .record-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: var(--radius-md);
    background: var(--bg);
    border: 1px solid var(--border);
    border-left: 4px solid var(--border);
  }
  .record-item--cleaning { border-left-color: var(--green); }
  .record-item--build     { border-left-color: #5a9fd4; }
  .record-badge { font-size: 22px; flex-shrink: 0; }
  .record-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .record-name {
    font-weight: 700;
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .record-meta {
    font-size: 13px;
    color: var(--gray);
  }
  .record-status {
    font-size: 12px;
    font-weight: 700;
    color: var(--warn);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .record-time {
    font-size: 12px;
    color: var(--gray);
    flex-shrink: 0;
    text-align: right;
  }
  .muted { color: var(--gray); font-size: 15px; }

  /* --- Form header --- */
  .form-header {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .form-title {
    font-size: 24px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .form-card { display: flex; flex-direction: column; gap: 18px; }

  /* --- Back button --- */
  .back-btn {
    display: inline-flex;
    align-items: center;
    padding: 10px 16px;
    border-radius: var(--radius-md);
    border: 1.5px solid var(--border);
    background: var(--white);
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    color: var(--charcoal);
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
    flex-shrink: 0;
  }
  .back-btn:active { background: var(--bg); }
  .back-btn--lg {
    width: 100%;
    justify-content: center;
    padding: 16px;
    font-size: 16px;
  }

  /* --- Field --- */
  .field { display: flex; flex-direction: column; gap: 8px; }
  .field-label {
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--charcoal-mid);
  }

  /* --- Inputs --- */
  .input {
    width: 100%;
    padding: 14px 16px;
    border-radius: var(--radius-md);
    border: 1.5px solid var(--border);
    background: var(--white);
    font-size: 16px;
    font-family: var(--font);
    color: var(--charcoal);
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    transition: border-color 0.15s;
  }
  .input:focus { border-color: var(--green-dark); }
  .input--initials {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    max-width: 140px;
  }
  .textarea {
    min-height: 100px;
    resize: vertical;
    line-height: 1.5;
  }

  /* --- Guide link --- */
  .guide-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    border-radius: var(--radius-md);
    border: 1.5px solid var(--border);
    background: var(--bg);
    color: var(--charcoal);
    text-decoration: none;
    font-size: 15px;
    font-weight: 700;
    -webkit-tap-highlight-color: transparent;
  }
  .guide-link:active { background: var(--border); }
  .guide-arrow { font-size: 18px; color: var(--gray); }

  /* --- Checklist --- */
  .checklist {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 4px 0;
  }
  .check-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px;
    border-radius: var(--radius-md);
    border: 1.5px solid var(--border);
    background: var(--white);
    cursor: pointer;
    transition: background 0.1s, border-color 0.1s;
    -webkit-tap-highlight-color: transparent;
    min-height: 54px;
  }
  .check-row--checked {
    background: var(--green-soft);
    border-color: var(--green);
  }
  .check-box {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 2px solid var(--border);
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 900;
    color: var(--green-dark);
    flex-shrink: 0;
    transition: background 0.1s, border-color 0.1s;
  }
  .check-box--checked {
    background: var(--green);
    border-color: var(--green-dark);
    color: var(--white);
  }
  .check-label {
    font-size: 15px;
    font-weight: 600;
    color: var(--charcoal);
    flex: 1;
  }
  .sr-only {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    border: 0;
  }

  /* --- Progress bar --- */
  .progress-bar-wrap {
    height: 6px;
    background: var(--border);
    border-radius: 99px;
    overflow: hidden;
    margin-top: 4px;
  }
  .progress-bar {
    height: 100%;
    background: var(--green);
    border-radius: 99px;
    transition: width 0.25s ease;
  }

  /* --- Status group --- */
  .status-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .status-option {
    display: flex;
    align-items: center;
    padding: 14px 16px;
    border-radius: var(--radius-md);
    border: 1.5px solid var(--border);
    background: var(--white);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.1s, border-color 0.1s;
    -webkit-tap-highlight-color: transparent;
    min-height: 52px;
  }
  .status-option--active             { background: var(--green-soft); border-color: var(--green); font-weight: 800; }
  .status-option--warn.status-option--active  { background: #fff3e0; border-color: var(--warn); }
  .status-option--alert.status-option--active { background: #fdecea; border-color: var(--alert); }

  /* --- Submit button --- */
  .submit-btn {
    width: 100%;
    padding: 18px;
    border-radius: var(--radius-md);
    border: none;
    background: var(--green);
    color: var(--charcoal);
    font-size: 16px;
    font-weight: 900;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: background 0.15s, transform 0.1s;
  }
  .submit-btn:active { transform: scale(0.98); background: #7ab532; }
  .submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  /* --- Error --- */
  .error-msg {
    color: var(--alert);
    font-size: 14px;
    font-weight: 600;
    padding: 12px 14px;
    background: #fdecea;
    border-radius: var(--radius-sm);
    border: 1px solid #f5c6c2;
  }

  /* --- Success screen --- */
  .success-screen {
    max-width: 600px;
    margin: 0 auto;
    padding: 32px 16px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
  }
  .success-icon {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: var(--green);
    color: var(--white);
    font-size: 36px;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .success-heading {
    font-size: 30px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .success-sub { font-size: 16px; color: var(--gray); max-width: 340px; }
  .success-detail {
    width: 100%;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .detail-row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    font-size: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
  }
  .detail-row:last-child { border-bottom: none; padding-bottom: 0; }
  .detail-label { font-weight: 700; color: var(--charcoal-mid); flex-shrink: 0; }
  .detail-value { color: var(--charcoal); text-align: right; word-break: break-word; }
  .success-actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* --- Tablet+ --- */
  @media (min-width: 520px) {
    .screen { padding: 24px 24px 48px; gap: 18px; }
    .app-title { font-size: 34px; }
    .action-card { min-height: 150px; }
    .action-icon { font-size: 42px; }
  }
`;
