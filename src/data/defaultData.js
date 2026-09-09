export const DEFAULT_PORTFOLIO_DATA = {
  profile: {
    fullName: "Hon. Mariam Awad",
    title: "Presiding Judge & Senior Judicial Arbitrator",
    tagline: "Administering justice with principled jurisprudence, impartiality, and an unwavering commitment to the rule of law.",
    bio: "The Honorable Mariam Awad is a distinguished Presiding Judge of the Court of Appeal, specializing in commercial litigation, banking disputes, civil jurisprudence, and international commercial arbitration. With over fifteen years of judicial service, she is renowned for authoring landmark appellate judgments, establishing binding legal precedents, and serving as a presiding arbitrator in multi-million-dollar cross-border tribunals. Dedicated to judicial independence, meticulous statutory reasoning, and the modern advancement of courtroom evidence.",
    location: "Palace of Justice, High Judicial Council, Cairo, Egypt",
    email: "chambers.mariam.awad@judiciary.org",
    phone: "+20 (2) 2577 8800",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
    resumeUrl: "#",
    openToWork: true,
    socials: {
      github: "https://orcid.org", // Judicial scholar orcid profile
      linkedin: "https://linkedin.com/in/judge-mariam-awad",
      twitter: "https://twitter.com/judge_mariam",
      website: "https://chambers-mariam-awad.org"
    },
    stats: [
      { label: "Years on the Bench", value: "15+" },
      { label: "Landmark Judgments", value: "280+" },
      { label: "Judicial Fellowships", value: "12+" },
      { label: "Arbitrated Tribunals", value: "65+" }
    ]
  },
  certificates: [
    {
      id: "cert-1",
      title: "State Judicial Appointment & Supreme Bench Qualification Fellowship",
      issuer: "National Institute for Judicial Studies (NIJS) / Supreme Judicial Council",
      issueDate: "November 2021",
      expiryDate: "Life Tenure Appointment",
      credentialId: "NIJS-SJC-99410",
      credentialUrl: "https://nijs.gov.eg/registry/verify",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
      description: "Highest state judicial fellowship awarded upon rigorous evaluation of appellate adjudication, constitutional review, civil code interpretation, and courtroom trial presidency with Highest Honors.",
      skills: ["Civil Jurisprudence", "Appellate Adjudication", "Constitutional Law", "Bench Leadership", "Judicial Ethics"],
      featured: true
    },
    {
      id: "cert-2",
      title: "Fellow of the Chartered Institute of Arbitrators (FCIArb)",
      issuer: "Chartered Institute of Arbitrators (CIArb, London)",
      issueDate: "March 2020",
      expiryDate: "Permanent Fellow",
      credentialId: "CIARB-LON-84210",
      credentialUrl: "https://ciarb.org/membership/fellows",
      imageUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800",
      description: "Premier global accreditation certifying peerless mastery in international commercial arbitration, tribunal presiding, UNCITRAL arbitration rules, cross-border award formulation, and global enforcement.",
      skills: ["Commercial Arbitration", "Tribunal Presiding", "Award Drafting", "UNCITRAL Rules", "New York Convention"],
      featured: true
    },
    {
      id: "cert-3",
      title: "Doctor of Juridical Science (S.J.D. / Ph.D. in Comparative Commercial Law)",
      issuer: "Cairo University Faculty of Law & Sorbonne International Faculty",
      issueDate: "June 2018",
      expiryDate: "Doctorate Degree",
      credentialId: "DOC-LAW-55102",
      credentialUrl: "https://law.cu.edu.eg/doctoral-register",
      imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
      description: "Doctoral dissertation on 'Contractual Equilibrium and Cross-Border Investment Concessions in Civil Law Jurisdictions', awarded Summa Cum Laude with unanimous judicial commendation.",
      skills: ["Comparative Law", "Commercial Concessions", "Civil Obligations", "Doctoral Jurisprudence"],
      featured: true
    },
    {
      id: "cert-4",
      title: "Judicial Program in Public International Law & State Immunity",
      issuer: "The Hague Academy of International Law / Peace Palace",
      issueDate: "August 2017",
      expiryDate: "Permanent Diploma",
      credentialId: "HAGUE-INTL-3901",
      credentialUrl: "https://hagueacademy.nl/alumni",
      imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800",
      description: "Specialized diplomatic and judicial fellowship on public international law, sovereign immunity doctrines, international court of justice (ICJ) procedures, and treaty interpretation.",
      skills: ["Public International Law", "State Immunity", "Treaty Interpretation", "Bilateral Investment Treaties"],
      featured: false
    },
    {
      id: "cert-5",
      title: "Advanced Judicial Mediation & Alternative Dispute Resolution Diploma",
      issuer: "Harvard Law School Program on Negotiation (PON)",
      issueDate: "September 2016",
      expiryDate: "Permanent Credential",
      credentialId: "HLS-PON-78142",
      credentialUrl: "https://execed.law.harvard.edu",
      imageUrl: "https://images.unsplash.com/photo-1436450412740-6b988f486c6b?auto=format&fit=crop&q=80&w=800",
      description: "Executive qualification in high-stakes multi-party negotiation, court-annexed mediation techniques, consensus building, and restorative dispute resolution mechanisms.",
      skills: ["Judicial Mediation", "ADR Conciliation", "Conflict De-escalation", "Complex Settlement Strategy"],
      featured: false
    },
    {
      id: "cert-6",
      title: "WIPO Certificate in International Intellectual Property Adjudication",
      issuer: "World Intellectual Property Organization (WIPO, Geneva)",
      issueDate: "April 2015",
      expiryDate: "Permanent Credential",
      credentialId: "WIPO-JUD-12093",
      credentialUrl: "https://wipo.int/academy/verify",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
      description: "Specialized qualification for high court judges on patent litigation, trade secrets injunctions, trademark infringements, and international copyright conventions.",
      skills: ["Intellectual Property", "Patent Litigation", "Trade Secrets Law", "Technology Injunctions"],
      featured: false
    }
  ],
  projects: [
    {
      id: "case-1",
      title: "Appellate Judgment No. 1422: Sovereign Commercial Concession & Force Majeure",
      description: "Presided over and authored a definitive precedent regarding state commercial contracts, the doctrine of unforeseen economic hardship, and cross-border enforcement standards under the New York Convention.",
      techStack: ["Civil Code", "Commercial Law", "Force Majeure", "Appellate Precedent", "Sovereign Contracts"],
      liveUrl: "https://judiciary-archive.gov.eg/rulings/case-1422-appeal",
      githubUrl: "https://chambers-archive.org/cases/1422",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
      featured: true
    },
    {
      id: "case-2",
      title: "International Arbitral Award: Mega-Infrastructure Energy Consortium Dispute ($185M)",
      description: "Sole Arbitrator presiding over an international dispute between a multinational energy contractor and a state infrastructure authority, issuing a comprehensive, enforceable arbitral award with forensic delay assessments.",
      techStack: ["CIArb Arbitration", "FIDIC Silver Book", "Delay Analysis", "Enforceable Award", "CRCICA Rules"],
      liveUrl: "https://arbitration-registry.org/awards/energy-consortium-185",
      githubUrl: "https://chambers-archive.org/arbitration/award-185",
      imageUrl: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800",
      featured: true
    },
    {
      id: "case-3",
      title: "Judicial Treatise: 'Evidentiary Standards in Electronic Contracts, Cryptography & AI'",
      description: "A published 340-page authoritative monograph examining evidentiary admissibility, burden of proof in digital transactions, smart contract liability, and modern electronic judicial records.",
      techStack: ["Legal Scholarship", "Digital Evidence", "Cyber Jurisprudence", "Judicial Codification"],
      liveUrl: "https://judicial-studies.gov.eg/publications/electronic-evidence-treatise",
      githubUrl: "https://chambers-archive.org/publications/treatise-digital-law",
      imageUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&q=80&w=800",
      featured: true
    },
    {
      id: "case-4",
      title: "Court Ruling No. 891: Corporate Governance, Shareholder Protection & Fiduciary Breach",
      description: "High Court ruling establishing binding judicial guidelines regarding directors' fiduciary obligations during leveraged buyouts, minority shareholder safeguards, and forensic accounting validity.",
      techStack: ["Corporate Law", "Shareholder Rights", "Fiduciary Duty", "Forensic Accounting"],
      liveUrl: "https://judiciary-archive.gov.eg/rulings/case-891-corporate",
      githubUrl: "https://chambers-archive.org/cases/891",
      imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=800",
      featured: false
    }
  ],
  skills: [
    {
      category: "Courtroom Adjudication & Bench Control",
      items: [
        "Statutory Reasoning & Construction",
        "Appellate Decree Drafting",
        "Courtroom Trial Management",
        "Evidentiary & Forensic Evaluation",
        "Judicial Ethics & Impartiality",
        "Injunctions & Expedited Decrees"
      ]
    },
    {
      category: "Substantive Jurisprudence",
      items: [
        "Commercial & Corporate Law",
        "Civil Obligations & Torts",
        "Banking & Financial Instruments",
        "Constitutional & Administrative Review",
        "Intellectual Property & Trade Secrets",
        "Real Estate & Construction Disputes"
      ]
    },
    {
      category: "International Arbitration & ADR",
      items: [
        "CIArb Fellowship (London)",
        "ICC & CRCICA Arbitral Rules",
        "Tribunal Presidency & Hearing Control",
        "Arbitral Award Drafting",
        "1958 New York Convention Enforcement",
        "Court-Annexed Judicial Mediation"
      ]
    },
    {
      category: "Scholarship & Judicial Leadership",
      items: [
        "Comparative Legal Analysis",
        "Judicial Mentorship & Training",
        "Legislative Reform Drafting",
        "Supreme Court Procedural Rules",
        "Electronic Court Systems & Digital Justice"
      ]
    }
  ],
  experience: [
    {
      role: "Presiding Judge (رئيس محكمة بالاستئناف)",
      company: "Court of Appeal — Commercial & Corporate Circuits",
      period: "2020 - Present",
      description: "Presiding over multi-million-pound commercial appeals, cross-border corporate reorganizations, banking disputes, and challenge proceedings against international arbitral awards; authored over 140 binding appellate judgments."
    },
    {
      role: "Judicial Counselor & Magistrate (مستشار وقاضٍ)",
      company: "First-Instance Civil & Commercial Tribunal",
      period: "2015 - 2020",
      description: "Adjudicated high-stakes civil and commercial trials, issued provisional preservation orders, supervised court-annexed mediation circuits, and streamlined case management."
    },
    {
      role: "Member of the Technical Bureau & Judicial Inspection (عضو المكتب الفني والتفتيش القضائي)",
      company: "Supreme Judicial Council / Ministry of Justice",
      period: "2011 - 2015",
      description: "Conducted legislative review of civil procedure reforms, prepared legal memoranda on conflicting precedents for high judicial assemblies, and monitored court performance standards."
    },
    {
      role: "Public Prosecutor & Judicial Officer (النيابة العامة والقضاء)",
      company: "General Prosecution Department",
      period: "2008 - 2011",
      description: "Investigated major financial and commercial crimes, presented state indictments before criminal tribunals, and supervised evidentiary chain of custody."
    }
  ]
};
