import React, { useMemo, useState } from "react";
import emailjs from "@emailjs/browser";

// EmailJS setup
// In production, these can be moved to Vercel environment variables.
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

function emailJsIsConfigured() {
  return (
    !EMAILJS_SERVICE_ID.includes("PASTE_YOUR") &&
    !EMAILJS_TEMPLATE_ID.includes("PASTE_YOUR") &&
    !EMAILJS_PUBLIC_KEY.includes("PASTE_YOUR")
  );
}

async function sendEmailWithEmailJS(record) {
  if (!emailJsIsConfigured()) {
    throw new Error(
      "EmailJS is not configured yet. Add your Service ID, Template ID, and Public Key."
    );
  }

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

  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    templateParams,
    {
      publicKey: EMAILJS_PUBLIC_KEY,
      limitRate: {
        id: "equipment-tracker-submit",
        throttle: 1000,
      },
    }
  );

  return {
    ok: true,
    message: "Email sent successfully.",
  };
}

export default function EquipmentCleaningBuildApp() {
  const [screen, setScreen] = useState("home");
  const [records, setRecords] = useState([]);

  function addRecord(record) {
    setRecords((currentRecords) => [record, ...currentRecords]);
  }

  return (
    <div style={styles.page}>
      <div style={styles.appContainer}>
        {screen === "home" && (
          <HomeScreen records={records} setScreen={setScreen} />
        )}

        {screen === "clean" && (
          <CleaningScreen
            goHome={() => setScreen("home")}
            addRecord={addRecord}
          />
        )}

        {screen === "build" && (
          <BuildScreen
            goHome={() => setScreen("home")}
            addRecord={addRecord}
          />
        )}
      </div>
    </div>
  );
}

function HomeScreen({ records, setScreen }) {
  return (
    <>
      <div style={styles.heroCard}>
        <p style={styles.kicker}>Equipment Tracker</p>
        <h1 style={styles.title}>Cleaning & Build Sign-Off</h1>
        <p style={styles.subtitle}>
          Select equipment, enter initials, and send cleaning or build completion
          emails automatically.
        </p>
      </div>

      <div style={styles.homeButtons}>
        <button style={styles.homeButton} onClick={() => setScreen("clean")}>
          <span style={styles.homeButtonIcon}>✓</span>
          Clean Equipment
        </button>

        <button style={styles.homeButton} onClick={() => setScreen("build")}>
          <span style={styles.homeButtonIcon}>🔧</span>
          Build Equipment
        </button>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Recent Submissions</h2>

        {records.length === 0 ? (
          <p style={styles.mutedText}>No records submitted yet.</p>
        ) : (
          <div style={styles.recordList}>
            {records.slice(0, 8).map((record, index) => (
              <div key={index} style={styles.recordItem}>
                <div>
                  <strong>
                    {record.recordType}: {record.equipmentName}
                  </strong>
                  <p style={styles.smallText}>Initials: {record.initials}</p>
                  {record.status && (
                    <p style={styles.smallText}>Status: {record.status}</p>
                  )}
                </div>
                <p style={styles.timestamp}>{record.timestamp}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function CleaningScreen({ goHome, addRecord }) {
  const [equipmentId, setEquipmentId] = useState(equipmentList[0].id);
  const [initials, setInitials] = useState("");
  const [notes, setNotes] = useState("");
  const [submittedRecord, setSubmittedRecord] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  const selectedEquipment = equipmentList.find((item) => item.id === equipmentId);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!initials.trim()) {
      alert("Please enter initials before submitting.");
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

    try {
      setSubmitMessage("Sending email...");
      const result = await sendEmailWithEmailJS(record);
      addRecord(record);
      setSubmittedRecord(record);
      setSubmitMessage(result.message);
      setInitials("");
      setNotes("");
    } catch (error) {
      console.error(error);
      setSubmitMessage(
        error.message || "Email failed to send. Check your EmailJS setup."
      );
    }
  }

  return (
    <>
      <BackButton goHome={goHome} />

      <div style={styles.card}>
        <h1 style={styles.formTitle}>Clean Equipment</h1>
        <p style={styles.mutedText}>
          Record which equipment was cleaned and who completed it.
        </p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <FormLabel>Equipment</FormLabel>
          <select
            style={styles.input}
            value={equipmentId}
            onChange={(event) => setEquipmentId(event.target.value)}
          >
            {equipmentList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - {item.id}
              </option>
            ))}
          </select>

          <FormLabel>Initials</FormLabel>
          <input
            style={styles.input}
            value={initials}
            maxLength={5}
            placeholder="Example: JL"
            onChange={(event) => setInitials(event.target.value)}
          />

          <FormLabel>Notes</FormLabel>
          <textarea
            style={styles.textarea}
            value={notes}
            placeholder="Optional notes, lot number, condition, or issue found..."
            onChange={(event) => setNotes(event.target.value)}
          />

          <button style={styles.submitButton} type="submit">
            Submit Cleaning Record
          </button>

          {submitMessage && <p style={styles.smallText}>{submitMessage}</p>}
        </form>
      </div>

      {submittedRecord && <EmailPreview record={submittedRecord} />}
    </>
  );
}

function BuildScreen({ goHome, addRecord }) {
  const [equipmentId, setEquipmentId] = useState(equipmentList[0].id);
  const [initials, setInitials] = useState("");
  const [status, setStatus] = useState("Complete");
  const [notes, setNotes] = useState("");
  const [checkedSteps, setCheckedSteps] = useState({});
  const [submittedRecord, setSubmittedRecord] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  const selectedEquipment = equipmentList.find((item) => item.id === equipmentId);

  const completedStepCount = useMemo(() => {
    return selectedEquipment.buildSteps.filter((step) => checkedSteps[step]).length;
  }, [checkedSteps, selectedEquipment]);

  function handleEquipmentChange(event) {
    setEquipmentId(event.target.value);
    setCheckedSteps({});
    setSubmittedRecord(null);
    setSubmitMessage("");
  }

  function toggleStep(step) {
    setCheckedSteps((current) => ({
      ...current,
      [step]: !current[step],
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!initials.trim()) {
      alert("Please enter initials before submitting.");
      return;
    }

    const completedSteps = selectedEquipment.buildSteps.filter(
      (step) => checkedSteps[step]
    );

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

    try {
      setSubmitMessage("Sending email...");
      const result = await sendEmailWithEmailJS(record);
      addRecord(record);
      setSubmittedRecord(record);
      setSubmitMessage(result.message);
      setInitials("");
      setNotes("");
      setCheckedSteps({});
    } catch (error) {
      console.error(error);
      setSubmitMessage(
        error.message || "Email failed to send. Check your EmailJS setup."
      );
    }
  }

  return (
    <>
      <BackButton goHome={goHome} />

      <div style={styles.card}>
        <h1 style={styles.formTitle}>Build Equipment</h1>
        <p style={styles.mutedText}>
          Open the build guide, complete the checklist, and submit build sign-off.
        </p>

        <form style={styles.form} onSubmit={handleSubmit}>
          <FormLabel>Equipment</FormLabel>
          <select
            style={styles.input}
            value={equipmentId}
            onChange={handleEquipmentChange}
          >
            {equipmentList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - {item.id}
              </option>
            ))}
          </select>

          <div style={styles.guideBox}>
            <div>
              <strong>Build Guide</strong>
              <p style={styles.smallText}>
                Replace this with the real SharePoint file, PDF, Excel guide, or
                SharePoint page link.
              </p>
            </div>
            <a
              href={selectedEquipment.buildGuideLink}
              target="_blank"
              rel="noreferrer"
              style={styles.guideButton}
            >
              Open Guide
            </a>
          </div>

          <FormLabel>Build Checklist</FormLabel>
          <div style={styles.checklistBox}>
            {selectedEquipment.buildSteps.map((step) => (
              <label key={step} style={styles.checklistItem}>
                <input
                  type="checkbox"
                  checked={Boolean(checkedSteps[step])}
                  onChange={() => toggleStep(step)}
                />
                <span>{step}</span>
              </label>
            ))}
            <p style={styles.smallText}>
              Completed: {completedStepCount} of {selectedEquipment.buildSteps.length}
            </p>
          </div>

          <FormLabel>Initials</FormLabel>
          <input
            style={styles.input}
            value={initials}
            maxLength={5}
            placeholder="Example: JL"
            onChange={(event) => setInitials(event.target.value)}
          />

          <FormLabel>Build Status</FormLabel>
          <select
            style={styles.input}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="Complete">Complete</option>
            <option value="Issue Found">Issue Found</option>
            <option value="Needs Supervisor Review">Needs Supervisor Review</option>
          </select>

          <FormLabel>Notes</FormLabel>
          <textarea
            style={styles.textarea}
            value={notes}
            placeholder="Optional notes, missing parts, or issue found..."
            onChange={(event) => setNotes(event.target.value)}
          />

          <button style={styles.submitButton} type="submit">
            Submit Build Record
          </button>

          {submitMessage && <p style={styles.smallText}>{submitMessage}</p>}
        </form>
      </div>

      {submittedRecord && <EmailPreview record={submittedRecord} />}
    </>
  );
}

function BackButton({ goHome }) {
  return (
    <button style={styles.backButton} onClick={goHome}>
      ← Back
    </button>
  );
}

function FormLabel({ children }) {
  return <label style={styles.label}>{children}</label>;
}

function EmailPreview({ record }) {
  const subject = `Equipment ${record.recordType} Submitted - ${record.equipmentName}`;

  return (
    <div style={styles.successCard}>
      <h2 style={styles.successTitle}>Submission Recorded</h2>
      <p style={styles.mutedText}>This is the information sent through EmailJS.</p>

      <div style={styles.emailBox}>
        <p>
          <strong>Subject:</strong> {subject}
        </p>
        <hr style={styles.hr} />
        <p>A {record.recordType.toLowerCase()} record has been submitted.</p>
        <p>
          <strong>Equipment:</strong> {record.equipmentName}
        </p>
        <p>
          <strong>Initials:</strong> {record.initials}
        </p>
        <p>
          <strong>Date/Time:</strong> {record.timestamp}
        </p>
        {record.status && (
          <p>
            <strong>Status:</strong> {record.status}
          </p>
        )}
        {record.completedSteps && (
          <p>
            <strong>Completed Steps:</strong>{" "}
            {record.completedSteps.length > 0
              ? record.completedSteps.join(", ")
              : "None checked"}
          </p>
        )}
        {record.buildGuideLink && (
          <p>
            <strong>Build Guide:</strong> {record.buildGuideLink}
          </p>
        )}
        {record.notes && (
          <p>
            <strong>Notes:</strong> {record.notes}
          </p>
        )}
      </div>
    </div>
  );
}

const brand = {
  charcoal: "#3f4444",
  charcoalDark: "#242828",
  mediumGray: "#6f7473",
  lightGray: "#eef1ef",
  cardGray: "#f7f8f6",
  borderGray: "#d9dedb",
  green: "#9bd23c",
  greenDark: "#5f8f1f",
  greenSoft: "#edf8dc",
  white: "#ffffff",
};

const styles = {
  page: {
    minHeight: "100vh",
    background: `linear-gradient(135deg, ${brand.lightGray} 0%, #ffffff 55%, ${brand.greenSoft} 100%)`,
    padding: "20px",
    fontFamily:
      "Gotham, Montserrat, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    color: brand.charcoalDark,
  },
  appContainer: {
    width: "100%",
    maxWidth: "760px",
    margin: "0 auto",
  },
  heroCard: {
    background: `linear-gradient(135deg, ${brand.charcoalDark} 0%, ${brand.charcoal} 72%, ${brand.greenDark} 100%)`,
    color: brand.white,
    borderRadius: "28px",
    padding: "28px",
    boxShadow: "0 18px 44px rgba(36, 40, 40, 0.22)",
    marginBottom: "18px",
    border: `1px solid ${brand.charcoal}`,
  },
  kicker: {
    margin: 0,
    fontSize: "13px",
    color: brand.green,
    fontWeight: 800,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
  },
  title: {
    margin: "8px 0 8px",
    fontSize: "34px",
    lineHeight: 1.1,
    letterSpacing: "0.02em",
    textTransform: "uppercase",
  },
  subtitle: {
    margin: 0,
    color: "#e7ece9",
    fontSize: "16px",
    lineHeight: 1.5,
  },
  homeButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
    marginBottom: "18px",
  },
  homeButton: {
    minHeight: "120px",
    border: `1px solid ${brand.borderGray}`,
    borderRadius: "24px",
    background: brand.white,
    color: brand.charcoalDark,
    fontSize: "20px",
    fontWeight: 800,
    boxShadow: "0 8px 28px rgba(36, 40, 40, 0.08)",
    cursor: "pointer",
    letterSpacing: "0.02em",
  },
  homeButtonIcon: {
    display: "block",
    fontSize: "30px",
    marginBottom: "8px",
    color: brand.greenDark,
  },
  card: {
    background: brand.white,
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 8px 28px rgba(36, 40, 40, 0.08)",
    marginBottom: "18px",
    border: `1px solid ${brand.borderGray}`,
  },
  sectionTitle: {
    margin: "0 0 12px",
    fontSize: "22px",
    color: brand.charcoalDark,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  formTitle: {
    margin: "0 0 8px",
    fontSize: "30px",
    color: brand.charcoalDark,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  mutedText: {
    color: brand.mediumGray,
    margin: "0 0 12px",
    lineHeight: 1.5,
  },
  smallText: {
    color: brand.mediumGray,
    fontSize: "14px",
    margin: "4px 0",
  },
  timestamp: {
    color: brand.mediumGray,
    fontSize: "12px",
    margin: 0,
    whiteSpace: "nowrap",
  },
  recordList: {
    display: "grid",
    gap: "10px",
  },
  recordItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    background: brand.cardGray,
    border: `1px solid ${brand.borderGray}`,
    borderLeft: `6px solid ${brand.green}`,
    borderRadius: "16px",
    padding: "12px",
  },
  form: {
    display: "grid",
    gap: "10px",
    marginTop: "18px",
  },
  label: {
    fontWeight: 800,
    color: brand.charcoal,
    fontSize: "14px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: `1px solid ${brand.borderGray}`,
    borderRadius: "14px",
    padding: "14px",
    fontSize: "16px",
    outline: "none",
    background: brand.white,
    color: brand.charcoalDark,
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    minHeight: "110px",
    border: `1px solid ${brand.borderGray}`,
    borderRadius: "14px",
    padding: "14px",
    fontSize: "16px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    background: brand.white,
    color: brand.charcoalDark,
  },
  submitButton: {
    marginTop: "8px",
    border: 0,
    borderRadius: "16px",
    padding: "16px",
    background: brand.green,
    color: brand.charcoalDark,
    fontSize: "17px",
    fontWeight: 900,
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    boxShadow: "0 10px 24px rgba(95, 143, 31, 0.24)",
  },
  backButton: {
    marginBottom: "12px",
    border: `1px solid ${brand.borderGray}`,
    borderRadius: "14px",
    padding: "11px 14px",
    background: brand.white,
    color: brand.charcoalDark,
    fontWeight: 800,
    cursor: "pointer",
  },
  guideBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    background: brand.cardGray,
    border: `1px solid ${brand.borderGray}`,
    borderLeft: `6px solid ${brand.green}`,
    borderRadius: "16px",
    padding: "14px",
  },
  guideButton: {
    background: brand.charcoalDark,
    color: brand.white,
    borderRadius: "12px",
    padding: "10px 12px",
    textDecoration: "none",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  checklistBox: {
    border: `1px solid ${brand.borderGray}`,
    borderRadius: "16px",
    padding: "10px",
    display: "grid",
    gap: "8px",
    background: brand.white,
  },
  checklistItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: brand.cardGray,
    borderRadius: "12px",
    padding: "10px",
    cursor: "pointer",
    fontWeight: 650,
    border: `1px solid ${brand.borderGray}`,
  },
  successCard: {
    background: brand.greenSoft,
    border: `1px solid ${brand.green}`,
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 8px 28px rgba(36, 40, 40, 0.08)",
    marginBottom: "18px",
  },
  successTitle: {
    margin: "0 0 8px",
    color: brand.greenDark,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  emailBox: {
    background: brand.white,
    borderRadius: "16px",
    padding: "16px",
    border: `1px solid ${brand.borderGray}`,
    lineHeight: 1.5,
    overflowWrap: "anywhere",
  },
  hr: {
    border: 0,
    borderTop: `1px solid ${brand.borderGray}`,
    margin: "12px 0",
  },
};
