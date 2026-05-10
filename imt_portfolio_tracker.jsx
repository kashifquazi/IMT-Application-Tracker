import { useState, useEffect, useCallback } from "react";

const DOMAINS = [
  {
    id: "msra",
    label: "MSRA Preparation",
    color: "#1B4F8A",
    bg: "#EBF2FA",
    maxPoints: null,
    info: "The MSRA is sat before the interview/portfolio stage. It consists of two papers — Clinical Problem Solving (CPS) and Professional Dilemmas (PD). Your MSRA score is a significant component of your overall ranking.",
    items: [
      { id: "msra1", label: "Registered for MSRA and confirmed exam date", tip: "Book early — centres fill up. Check the IMT recruitment timeline each year.", points: null },
      { id: "msra2", label: "Practising CPS questions regularly (300+ target)", tip: "Passmedicine, Pastest, and BMJ OnExamination all have CPS-style questions. Aim for daily practice.", points: null },
      { id: "msra3", label: "Completing PD practice papers and scenarios", tip: "PD tests ethical reasoning. Familiarise yourself with Good Medical Practice (GMC) principles.", points: null },
      { id: "msra4", label: "Reviewed MSRA blueprint and syllabus topics", tip: "The MSRA blueprint is publicly available on the IMT recruitment microsite.", points: null },
      { id: "msra5", label: "Mock MSRA completed under timed conditions", tip: "Time pressure is the main challenge. Simulate exam conditions at least 2–3 weeks before.", points: null },
    ],
  },
  {
    id: "qualifications",
    label: "Qualifications & Degrees",
    color: "#7B3FA0",
    bg: "#F4ECF7",
    maxPoints: 8,
    info: "Points awarded for additional qualifications beyond your primary medical degree. Intercalated degrees, Masters, and PhDs score highly. Check the current IMT person specification for exact scoring.",
    items: [
      { id: "q1", label: "Primary medical degree (MBChB / MBBS) obtained", tip: "Prerequisite — but confirm you meet the FY1 completion requirement for the application cycle.", points: 0 },
      { id: "q2", label: "Intercalated BSc / BA (pass)", tip: "Most intercalated degrees score points. Keep your certificate accessible.", points: 2 },
      { id: "q3", label: "Intercalated BSc / BA (merit or distinction)", tip: "Higher classification scores extra points in most scoring frameworks.", points: 3 },
      { id: "q4", label: "Masters degree (MSc / MRes / MA)", tip: "Relevant Masters in a medical/scientific field. Distance-learning Masters count.", points: 4 },
      { id: "q5", label: "PhD / MD / DPhil", tip: "Maximum qualification points. If in progress, this does not score until awarded.", points: 6 },
      { id: "q6", label: "Additional undergraduate degree (non-intercalated)", tip: "e.g. a prior degree before medicine. Check current guidance for exact scoring.", points: 3 },
    ],
  },
  {
    id: "mrcp",
    label: "MRCP Progress",
    color: "#1B7A5A",
    bg: "#E8F6F2",
    maxPoints: 20,
    info: "MRCP progress is one of the highest-scoring domains. Even Part 1 alone scores significant points. PACES (the clinical exam) scores the most. This is a major differentiator between candidates.",
    items: [
      { id: "m1", label: "MRCP Part 1 passed", tip: "Aim to sit Part 1 during FY2. Many candidates score this before applying. Passmedicine and BMJ OnEx are the go-to resources.", points: 6 },
      { id: "m2", label: "MRCP Part 2 Written passed", tip: "Harder to achieve before IMT application, but very impactful on your score if completed.", points: 12 },
      { id: "m3", label: "MRCP PACES passed (full membership)", tip: "Full MRCP membership scores maximum points. Exceptional if completed pre-IMT.", points: 20 },
      { id: "m4", label: "MRCP Part 1 revision plan in place", tip: "Not scoreable, but essential preparation. Aim for 6 months of structured revision.", points: null },
      { id: "m5", label: "Identified MRCP Part 1 sitting date", tip: "Sittings are held several times per year at Pearson VUE centres. Book early.", points: null },
    ],
  },
  {
    id: "publications",
    label: "Publications",
    color: "#C0541A",
    bg: "#FBEEE8",
    maxPoints: 12,
    info: "Publications demonstrate research engagement and academic productivity. First-author papers in peer-reviewed journals score highest. Even a published case report or letter adds meaningful points.",
    items: [
      { id: "p1", label: "First-author peer-reviewed original research paper", tip: "The gold standard. Submit to specialty journals relevant to your area. Consider BJGP, QJM, BMJ Open for accessibility.", points: 8 },
      { id: "p2", label: "Co-author peer-reviewed original research paper", tip: "Co-authorship still scores well. Collaborative research with a registrar or consultant is a realistic route.", points: 4 },
      { id: "p3", label: "First-author published case report", tip: "Accessible as a junior doctor. BMJ Case Reports, JRSM, specialty journals. Find an interesting case and approach your registrar/consultant.", points: 4 },
      { id: "p4", label: "Published letter / correspondence in a journal", tip: "Lower bar than a full paper. Write a response to a published article. Can be done quickly with consultant supervision.", points: 2 },
      { id: "p5", label: "Published review article / book chapter", tip: "Invited reviews score similarly to original research. Ask supervisors if they have any in progress.", points: 4 },
      { id: "p6", label: "Paper in submission / under review", tip: "Does not score until published, but keep progressing. Prepare with a clear target journal in mind.", points: null },
      { id: "p7", label: "ORCID iD created and publications linked", tip: "Essential for verifying your publication record. Free to set up at orcid.org.", points: null },
    ],
  },
  {
    id: "presentations",
    label: "Presentations",
    color: "#A0522D",
    bg: "#FDF0E8",
    maxPoints: 8,
    info: "Presentations at national and international meetings demonstrate communication skills and engagement with the medical community. Oral presentations score more than posters. Regional meetings are a good starting point.",
    items: [
      { id: "pr1", label: "International oral presentation (peer-reviewed abstract)", tip: "ESC, AHA, BTS, BSG Congress etc. High impact — submit abstracts to major specialty conferences.", points: 6 },
      { id: "pr2", label: "National oral presentation (peer-reviewed abstract)", tip: "RCPE, RCP London, BMA, specialty society meetings. More accessible than international meetings.", points: 4 },
      { id: "pr3", label: "International poster presentation", tip: "Submit poster abstracts to major international conferences. Still scores well.", points: 4 },
      { id: "pr4", label: "National poster presentation", tip: "The most accessible scoring presentation. Aim for at least one national poster from your audit or case report.", points: 2 },
      { id: "pr5", label: "Regional / local presentation (e.g. grand round, SpR teaching)", tip: "Does not score formally in most frameworks but builds experience and confidence for national presentations.", points: null },
      { id: "pr6", label: "Identified upcoming conference abstract deadlines", tip: "Abstract deadlines are typically 3–6 months before the conference. Keep a running list of upcoming meetings.", points: null },
    ],
  },
  {
    id: "audit",
    label: "Audit & Quality Improvement",
    color: "#B5860D",
    bg: "#FEF9EC",
    maxPoints: 6,
    info: "A completed audit cycle (with re-audit showing improvement) scores highest. Quality Improvement Projects (QIPs) using PDSA methodology are increasingly valued. You need documented evidence — keep records of everything.",
    items: [
      { id: "a1", label: "Completed full audit cycle (audit + re-audit)", tip: "Must show a change in practice between cycles. Register your audit with your trust's audit department for formal documentation.", points: 6 },
      { id: "a2", label: "Completed single-cycle audit (no re-audit yet)", tip: "Scores partial points. Plan your re-audit timeline now — don't leave it incomplete.", points: 3 },
      { id: "a3", label: "Completed QIP with measurable outcome using PDSA", tip: "PDSA (Plan-Do-Study-Act) cycles are the accepted QI methodology. Document your baseline, intervention, and outcome data.", points: 4 },
      { id: "a4", label: "Participated in a national audit (e.g. NICOR, MINAP)", tip: "Involvement in national clinical audits is recognised. Ensure you have a named contribution, not just data collection.", points: 2 },
      { id: "a5", label: "Audit or QIP presented locally or regionally", tip: "Presenting your findings demonstrates completion and communication skills.", points: null },
      { id: "a6", label: "Audit idea identified and registered with trust", tip: "Start early — ethical approval, data collection, and re-audit take months. Identify a gap in your department's practice.", points: null },
    ],
  },
  {
    id: "teaching",
    label: "Teaching & Education",
    color: "#1A6B8A",
    bg: "#E8F4F8",
    maxPoints: 4,
    info: "Teaching demonstrates leadership in education and communication skills. Formal teaching with feedback and learning outcomes is preferred over informal bedside teaching. Consider a PGCert in Medical Education if committed to this domain.",
    items: [
      { id: "t1", label: "Delivered formal teaching sessions with documented feedback", tip: "Medical student tutorials, FY1 teaching, simulation sessions. Get written feedback and retain it as evidence.", points: 4 },
      { id: "t2", label: "Organised a teaching programme or series", tip: "Running a weekly teaching series for students or FY1s demonstrates leadership in education.", points: 3 },
      { id: "t3", label: "Simulation-based teaching (mannequin, OSCE, skills sessions)", tip: "Simulation teaching is highly regarded. Many trusts have simulation centres you can access.", points: 2 },
      { id: "t4", label: "Completed a teaching qualification (PGCert in Medical Education)", tip: "Scores additional points. Many trusts run these programmes at low cost for junior doctors.", points: 3 },
      { id: "t5", label: "Acted as educational supervisor / clinical supervisor", tip: "Usually for FY1s. Requires formal trust recognition. Check eligibility criteria at your trust.", points: 2 },
      { id: "t6", label: "Contributed to an e-learning resource or written teaching material", tip: "Consider contributing to question banks, teaching websites, or online learning resources.", points: null },
    ],
  },
  {
    id: "leadership",
    label: "Leadership & Management",
    color: "#5A1F6B",
    bg: "#F2EAF7",
    maxPoints: 4,
    info: "Leadership roles demonstrate commitment beyond clinical practice. Elected positions in medical societies, BMA, or college roles score most reliably. Management project involvement is also valued.",
    items: [
      { id: "l1", label: "Elected committee / officer role in a medical society or college", tip: "Junior Cardiology Society, BMA Junior Doctors Committee, RCPE/RCP trainee roles. These score reliably across frameworks.", points: 4 },
      { id: "l2", label: "Junior doctor representative (trust or deanery level)", tip: "JDF, LNC, or education committee representative roles. Check for vacancies at your trust.", points: 3 },
      { id: "l3", label: "Led a trust-level project or initiative", tip: "e.g. induction programme reform, rota management, patient safety project. Needs documented evidence of your leadership role.", points: 2 },
      { id: "l4", label: "Completed an NHS leadership course (e.g. ILM, NHS Leadership Academy)", tip: "Demonstrates formal commitment to management skills. Many are free for NHS staff.", points: 2 },
      { id: "l5", label: "Mentored a junior colleague formally", tip: "Formal mentorship with a documented programme scores over informal mentoring.", points: null },
    ],
  },
  {
    id: "courses",
    label: "Courses & Prizes",
    color: "#8A1F1F",
    bg: "#F8EAEA",
    maxPoints: 6,
    info: "Life support courses (ALS) are required for IMT. Additional specialty courses and academic prizes add points. Medical school prizes and distinctions are still counted at application stage.",
    items: [
      { id: "c1", label: "ALS (Advanced Life Support) course completed", tip: "Mandatory for IMT. Ensure your certificate is in date (valid 4 years). Book well in advance through Resuscitation Council UK.", points: 2 },
      { id: "c2", label: "ATLS / APLS / ALSO or equivalent completed", tip: "Advanced trauma or paediatric life support courses add to your portfolio. ATLS is particularly valued.", points: 2 },
      { id: "c3", label: "Specialty course completed (e.g. echo accreditation, endoscopy, catheter skills)", tip: "BSE echo level 1, basic endoscopy, or cardiology-specific courses are highly relevant for IMT with a cardiology interest.", points: 2 },
      { id: "c4", label: "Medical school prize or academic distinction", tip: "Clinical prizes, anatomy prizes, Distinctions in finals — still recognised at application. Keep certificates.", points: 3 },
      { id: "c5", label: "Competitive scholarship or fellowship", tip: "Academic foundations, medical research fellowships, Wellcome or MRC awards. Rare but high scoring.", points: 4 },
      { id: "c6", label: "Good Clinical Practice (GCP) certification", tip: "Required for any research involvement. Free online via NIHR Learn. Renew every 3 years.", points: null },
    ],
  },
  {
    id: "portfolio_admin",
    label: "Application Admin & Portfolio",
    color: "#2C5F2E",
    bg: "#EAFAEB",
    maxPoints: null,
    info: "Essential administrative tasks that candidates often leave too late. The Oriel application portal opens and closes to tight deadlines. Personal statement and reference quality can be the difference at borderline scores.",
    items: [
      { id: "pa1", label: "Registered on Oriel and profile completed", tip: "NHS Oriel (oriel.nhs.uk) is the application portal. Set up your account before the application window opens.", points: null },
      { id: "pa2", label: "IMT person specification read and reviewed in full", tip: "Available on the IMT recruitment microsite. Understand exactly what is scored and how.", points: null },
      { id: "pa3", label: "All supporting evidence documents collected and scanned", tip: "Publications, presentation certificates, audit documentation, course certificates. Keep a single folder with everything.", points: null },
      { id: "pa4", label: "Personal statement drafted and peer-reviewed", tip: "Get this reviewed by a senior colleague or IMT doctor. Focus on commitment to specialty, career goals, and key achievements.", points: null },
      { id: "pa5", label: "Two referees approached and confirmed", tip: "Ideally a consultant who knows your clinical work well. Give them your CV and personal statement in advance.", points: null },
      { id: "pa6", label: "CV updated and tailored to IMT application", tip: "Include all publications, presentations, audits, and courses with dates. Ensure everything is verifiable.", points: null },
      { id: "pa7", label: "Shortlisted preferred deaneries / regions", tip: "Consider training opportunities, subspecialty availability, and personal circumstances. IMT is 2 years initially.", points: null },
      { id: "pa8", label: "Interview practice completed with mock panel", tip: "Practise clinical scenarios, ethical dilemmas, and commitment to specialty questions. Record yourself if possible.", points: null },
    ],
  },
];

const TOTAL_MAX = DOMAINS.filter(d => d.maxPoints).reduce((s, d) => s + d.maxPoints, 0);

export default function IMTTracker() {
  const [checked, setChecked] = useState({});
  const [activeTab, setActiveTab] = useState("msra");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("imt_tracker_v1");
        if (result?.value) setChecked(JSON.parse(result.value));
      } catch {}
      setLoaded(true);
    })();
  }, []);

  const save = useCallback(async (newChecked) => {
    setSaving(true);
    try { await window.storage.set("imt_tracker_v1", JSON.stringify(newChecked)); } catch {}
    setTimeout(() => setSaving(false), 800);
  }, []);

  const toggle = (id) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      save(next);
      return next;
    });
  };

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const domainScore = (domain) => {
    if (!domain.maxPoints) return null;
    const scored = domain.items.filter(i => i.points && checked[i.id]);
    const raw = scored.reduce((s, i) => s + i.points, 0);
    return Math.min(raw, domain.maxPoints);
  };

  const totalScore = DOMAINS.reduce((s, d) => {
    const sc = domainScore(d);
    return sc !== null ? s + sc : s;
  }, 0);

  const totalChecked = DOMAINS.flatMap(d => d.items).filter(i => checked[i.id]).length;
  const totalItems = DOMAINS.flatMap(d => d.items).length;

  const activeDomain = DOMAINS.find(d => d.id === activeTab);

  if (!loaded) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 300, fontFamily: "'DM Mono', monospace", fontSize: 14, color: "#888" }}>
      Loading your tracker…
    </div>
  );

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", maxWidth: 800, margin: "0 auto", padding: "1.5rem 1rem 3rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: "0.12em", color: "#888", marginBottom: 4, textTransform: "uppercase" }}>Internal Medicine Training</div>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0, color: "#111", lineHeight: 1.2 }}>Application Portfolio Tracker</h1>
            <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0", lineHeight: 1.5 }}>Track your progress across every domain of the IMT application. Tap items to mark complete.</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 28, fontWeight: 500, color: "#111", lineHeight: 1 }}>{totalScore}<span style={{ fontSize: 14, color: "#888", fontWeight: 400 }}>/{TOTAL_MAX}</span></div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>estimated portfolio pts</div>
            {saving && <div style={{ fontSize: 11, color: "#1B7A5A", marginTop: 4 }}>Saved</div>}
          </div>
        </div>

        {/* Overall progress bar */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#666" }}>Overall checklist completion</span>
            <span style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "#333" }}>{totalChecked}/{totalItems}</span>
          </div>
          <div style={{ height: 6, background: "#eee", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(totalChecked / totalItems) * 100}%`, background: "linear-gradient(90deg, #1B4F8A, #1B7A5A)", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Domain score pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
          {DOMAINS.map(d => {
            const sc = domainScore(d);
            const checked_count = d.items.filter(i => checked[i.id]).length;
            return (
              <button key={d.id} onClick={() => setActiveTab(d.id)} style={{ padding: "4px 10px", borderRadius: 99, border: `1.5px solid ${activeTab === d.id ? d.color : "#e0e0e0"}`, background: activeTab === d.id ? d.bg : "transparent", cursor: "pointer", fontSize: 11, color: activeTab === d.id ? d.color : "#666", fontWeight: activeTab === d.id ? 600 : 400, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: d.color, display: "inline-block", opacity: sc !== null ? Math.min((checked_count / d.items.length) + 0.1, 1) : 0.4 }} />
                {d.label}
                {sc !== null && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10 }}>{sc}/{d.maxPoints}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active domain */}
      {activeDomain && (
        <div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0, color: activeDomain.color }}>{activeDomain.label}</h2>
                {activeDomain.maxPoints && (
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, background: activeDomain.bg, color: activeDomain.color, padding: "2px 10px", borderRadius: 99, border: `1px solid ${activeDomain.color}30` }}>
                    {domainScore(activeDomain)}/{activeDomain.maxPoints} pts
                  </span>
                )}
              </div>
              <p style={{ fontSize: 13, color: "#555", margin: "6px 0 0", lineHeight: 1.6, maxWidth: 560 }}>{activeDomain.info}</p>
            </div>
          </div>

          {/* Domain progress */}
          {activeDomain.maxPoints && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ height: 4, background: "#eee", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(domainScore(activeDomain) / activeDomain.maxPoints) * 100}%`, background: activeDomain.color, borderRadius: 99, transition: "width 0.4s ease" }} />
              </div>
            </div>
          )}

          <div style={{ display: "grid", gap: 8 }}>
            {activeDomain.items.map(item => {
              const done = !!checked[item.id];
              const isExp = !!expanded[item.id];
              return (
                <div key={item.id} style={{ background: done ? activeDomain.bg : "#fafafa", border: `1px solid ${done ? activeDomain.color + "40" : "#e8e8e8"}`, borderRadius: 10, overflow: "hidden", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", cursor: "pointer" }} onClick={() => toggle(item.id)}>
                    <div style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${done ? activeDomain.color : "#ccc"}`, background: done ? activeDomain.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, transition: "all 0.15s" }}>
                      {done && <svg width="10" height="8" viewBox="0 0 10 8"><polyline points="1,4 4,7 9,1" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: done ? 500 : 400, color: done ? activeDomain.color : "#222", lineHeight: 1.4, textDecoration: done ? "none" : "none" }}>{item.label}</div>
                      {item.points && (
                        <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: done ? activeDomain.color : "#aaa", marginTop: 2 }}>+{item.points} pts</div>
                      )}
                    </div>
                    <button onClick={e => { e.stopPropagation(); toggleExpand(item.id); }} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 4px", color: "#aaa", fontSize: 16, lineHeight: 1, flexShrink: 0 }}>
                      {isExp ? "−" : "+"}
                    </button>
                  </div>
                  {isExp && (
                    <div style={{ padding: "0 14px 12px 46px", fontSize: 13, color: "#444", lineHeight: 1.6, borderTop: `1px solid ${activeDomain.color}20`, paddingTop: 10, background: done ? activeDomain.bg : "#f5f5f5" }}>
                      <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: activeDomain.color, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 4 }}>Guidance</span>
                      {item.tip}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Nav */}
          <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
            {(() => {
              const idx = DOMAINS.findIndex(d => d.id === activeTab);
              return (
                <>
                  {idx > 0 && (
                    <button onClick={() => setActiveTab(DOMAINS[idx - 1].id)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd", background: "transparent", cursor: "pointer", fontSize: 13, color: "#444", fontFamily: "'DM Sans', sans-serif" }}>
                      ← {DOMAINS[idx - 1].label}
                    </button>
                  )}
                  {idx < DOMAINS.length - 1 && (
                    <button onClick={() => setActiveTab(DOMAINS[idx + 1].id)} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${DOMAINS[idx + 1].color}50`, background: DOMAINS[idx + 1].bg, cursor: "pointer", fontSize: 13, color: DOMAINS[idx + 1].color, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", marginLeft: "auto" }}>
                      {DOMAINS[idx + 1].label} →
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}

      <div style={{ marginTop: 32, padding: "14px 16px", background: "#f5f5f5", borderRadius: 10, borderLeft: "3px solid #1B4F8A" }}>
        <div style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "#1B4F8A", marginBottom: 4, letterSpacing: "0.08em" }}>IMPORTANT NOTE</div>
        <p style={{ fontSize: 12, color: "#555", margin: 0, lineHeight: 1.6 }}>Point values shown are indicative based on published IMT person specifications. Exact scoring criteria change annually — always refer to the current year's IMT recruitment person specification on the IMT recruitment microsite and NHS Health Education England guidance. Your progress is saved automatically in this browser.</p>
      </div>
    </div>
  );
}
