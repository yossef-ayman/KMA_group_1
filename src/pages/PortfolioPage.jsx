import React, { useState } from 'react';
import {
  Award,
  ExternalLink,
  Mail,
  MapPin,
  Sparkles,
  ArrowRight,
  Search,
  RefreshCw,
  CheckCircle,
  Calendar,
  Briefcase,
  Layers,
  Send,
  Edit3,
  Scale,
  BookOpen,
  FileText,
  Shield,
  Gavel
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';
import { usePortfolio } from '../context/PortfolioContext';

export const PortfolioPage = () => {
  const {
    data,
    setActiveModalCert,
    navigateTo,
    setEditingCertId,
    refreshCertificates,
    showToast
  } = usePortfolio();

  const [certSearch, setCertSearch] = useState('');
  const [selectedIssuer, setSelectedIssuer] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  // Filter certificates
  const issuers = ['All', ...new Set(data.certificates.map((c) => c.issuer))];

  const filteredCertificates = data.certificates.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(certSearch.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(certSearch.toLowerCase()) ||
      (cert.skills && cert.skills.some((s) => s.toLowerCase().includes(certSearch.toLowerCase())));

    const matchesIssuer = selectedIssuer === 'All' || cert.issuer === selectedIssuer;
    return matchesSearch && matchesIssuer;
  });

  const handleRefreshCertificates = () => {
    setIsRefreshing(true);
    refreshCertificates();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      showToast(`Thank you, Counselor ${contactForm.name}. Your correspondence has been submitted to Chambers.`);
      setContactForm({ name: '', email: '', message: '' });
    }, 900);
  };

  return (
    <div className="relative overflow-hidden bg-[#faf7f2]">
      {/* Warm subtle background ambient glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#f0e4d0]/60 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[850px] right-5 w-[500px] h-[400px] bg-[#f5ebd8]/80 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[1700px] left-5 w-[600px] h-[450px] bg-[#ede1cb]/50 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* ============================================================ */}
      {/* HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Intro */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              {/* Judicial Bench Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#f4ece1] border border-[#dfd2c0] text-amber-900 text-xs font-semibold shadow-sm">
                <Scale className="w-4 h-4 text-amber-800" />
                <span>Court of Appeal • Commercial & Civil Circuit</span>
              </div>

              {/* Title & Name */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm font-bold tracking-widest text-stone-500 uppercase font-mono">
                  Official Judicial Portfolio & Legal Registry
                </p>
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-stone-900 judicial-heading">
                  <span className="gradient-gold">{data.profile.fullName}</span>
                </h1>
                <h2 className="text-xl sm:text-2xl font-semibold text-stone-700">
                  {data.profile.title}
                </h2>
                <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed mx-auto lg:mx-0 font-normal">
                  {data.profile.tagline}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => {
                    const target = document.querySelector('#certificates');
                    if (target) {
                      const navHeight = 84;
                      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-800 to-yellow-900 hover:from-amber-700 hover:to-yellow-800 shadow-md shadow-amber-950/20 transition-all transform hover:-translate-y-0.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Judicial Accreditations</span>
                </button>

                <button
                  onClick={() => {
                    const target = document.querySelector('#projects');
                    if (target) {
                      const navHeight = 84;
                      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-stone-800 bg-white hover:bg-[#f6eee4] border border-[#ded0bf] shadow-sm transition-all"
                >
                  <Gavel className="w-4 h-4 text-amber-800" />
                  <span>Landmark Rulings & Cases</span>
                </button>

                <button
                  onClick={() => navigateTo('admin')}
                  className="flex items-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-xs text-stone-600 hover:text-stone-900 bg-[#f4ece1] hover:bg-[#ebdccb] border border-[#dfd2c0] transition-colors"
                  title="Open Judicial Management"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-800" />
                  <span>Manage Portfolio</span>
                </button>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#e8dfd5]">
                {data.profile.stats.map((stat, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-[#e8dfd5] text-center shadow-sm">
                    <div className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
                      {stat.value}
                    </div>
                    <div className="text-xs text-stone-500 mt-1 font-semibold">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Avatar & Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-700/20 to-yellow-600/20 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition duration-500"></div>
                <div className="relative w-72 h-80 sm:w-88 sm:h-96 rounded-2xl overflow-hidden border-2 border-[#dfd2c0] bg-white shadow-xl">
                  <img
                    src={data.profile.avatarUrl}
                    alt={data.profile.fullName}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent flex items-end p-5">
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="text-sm font-bold text-white judicial-heading">
                          {data.profile.fullName}
                        </div>
                        <div className="text-xs text-amber-200 flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3" />
                          <span>{data.profile.location}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigateTo('admin')}
                        className="px-2.5 py-1 text-[11px] font-semibold text-stone-900 bg-amber-100 hover:bg-white rounded-lg shadow-sm transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3 text-amber-800" />
                        <span>Edit Photo</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* ABOUT SECTION */}
      {/* ============================================================ */}
      <section id="about" className="py-20 border-t border-[#e8dfd5] bg-[#f5ece1]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-900">
                <Scale className="w-4 h-4 text-amber-800" />
                <span>Judicial Philosophy & Chambers</span>
              </div>
              <h3 className="text-3xl font-bold text-stone-900 tracking-tight judicial-heading">
                Dedicated to Equitable Jurisprudence, Integrity & the Rule of Law
              </h3>
              <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
                {data.profile.bio}
              </p>

              <div className="pt-4 space-y-2.5 text-sm text-stone-700">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-amber-800 shrink-0" />
                  <span className="font-medium">Chambers Jurisdiction: {data.profile.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-amber-800 shrink-0" />
                  <span className="font-medium">{data.profile.email}</span>
                </div>
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="lg:col-span-7 space-y-6">
              <h4 className="text-xl font-bold text-stone-900 flex items-center gap-2.5 judicial-heading">
                <Briefcase className="w-5 h-5 text-amber-800" />
                <span>Judicial & Public Service Appointments</span>
              </h4>

              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white border border-[#e8dfd5] hover:border-[#cbb497] transition-all shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h5 className="text-base font-bold text-stone-900 judicial-heading">{exp.role}</h5>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        {exp.period}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-amber-800 mb-3">
                      {exp.company}
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CERTIFICATES & JUDICIAL ACCREDITATIONS (Core Focus) */}
      {/* ============================================================ */}
      <section id="certificates" className="py-24 border-t border-[#e8dfd5] bg-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-900 mb-2">
                <Award className="w-4 h-4 text-amber-800" />
                <span>Official Accreditations & Diplomas</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight judicial-heading">
                Verified Judicial Accreditations & Fellowships
              </h3>
              <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl">
                Certified fellowships and diplomas conferred by the National Institute of Judicial Studies, CIArb, Harvard Law School, and International Arbitral Bodies. Click any credential to inspect verification details.
              </p>
            </div>

            {/* Refresh & Manage Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefreshCertificates}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-[#f6eee4] border border-[#ded0bf] shadow-sm transition-all"
                title="Refresh certificates list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-800' : 'text-stone-500'}`} />
                <span>Refresh Credentials</span>
              </button>

              <button
                onClick={() => navigateTo('admin')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 shadow-sm transition-all"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Add / Edit Accreditations</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={certSearch}
                onChange={(e) => setCertSearch(e.target.value)}
                placeholder="Search credentials by title, legal domain, or institution..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-[#ded0bf] text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700 shadow-sm"
              />
            </div>

            {/* Institution Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {issuers.map((issuer) => (
                <button
                  key={issuer}
                  onClick={() => setSelectedIssuer(issuer)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedIssuer === issuer
                      ? 'bg-amber-800 text-white font-bold shadow-sm'
                      : 'bg-white text-stone-700 hover:bg-[#f6eee4] border border-[#ded0bf]'
                  }`}
                >
                  {issuer}
                </button>
              ))}
            </div>
          </div>

          {/* Certificates Grid */}
          {filteredCertificates.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-[#ded0bf] shadow-sm">
              <Award className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <p className="text-stone-600 font-medium text-sm">No accreditations found matching your search.</p>
              <button
                onClick={() => {
                  setCertSearch('');
                  setSelectedIssuer('All');
                }}
                className="mt-3 text-xs text-amber-800 font-bold hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertificates.map((cert) => (
                <div
                  key={cert.id}
                  onClick={() => setActiveModalCert(cert)}
                  className="beige-card rounded-2xl overflow-hidden cursor-pointer flex flex-col group relative transform transition-all duration-300 hover:-translate-y-1.5"
                >
                  {/* Thumbnail Banner */}
                  <div className="relative h-48 w-full bg-[#f4ede3] overflow-hidden">
                    <img
                      src={cert.imageUrl || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800"}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800";
                      }}
                    />
                    <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-transparent transition-colors" />

                    {/* Issuer Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 text-xs font-bold rounded-lg bg-white/95 backdrop-blur-md text-amber-950 border border-amber-300 shadow-md">
                        {cert.issuer}
                      </span>
                    </div>

                    {/* Quick Edit shortcut button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCertId(cert.id);
                        navigateTo('admin');
                      }}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-white/90 text-stone-600 hover:text-white hover:bg-amber-800 transition-colors border border-stone-200 shadow-md"
                      title="Edit this credential"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>Conferred {cert.issueDate}</span>
                      </div>

                      <h4 className="text-base font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-2 judicial-heading">
                        {cert.title}
                      </h4>

                      {cert.description && (
                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                          {cert.description}
                        </p>
                      )}
                    </div>

                    {/* Skills pills */}
                    {cert.skills && cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {cert.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-[#f4ede3] text-stone-800 border border-[#e4d8c7]"
                          >
                            {skill}
                          </span>
                        ))}
                        {cert.skills.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[11px] font-bold text-stone-500">
                            +{cert.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer / Trigger */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#e8dfd5] text-xs font-bold text-amber-900">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-amber-800" />
                        <span>View Official Registry</span>
                      </span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* LANDMARK RULINGS & PUBLICATIONS SECTION */}
      {/* ============================================================ */}
      <section id="projects" className="py-24 border-t border-[#e8dfd5] bg-[#f5ece1]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-900 mb-2">
                <Gavel className="w-4 h-4 text-amber-800" />
                <span>Precedents & Scholarship</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight judicial-heading">
                Landmark Rulings & Arbitral Awards
              </h3>
              <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-2xl">
                A selection of pivotal judicial rulings, international commercial arbitration awards, and published treatises establishing significant legal precedents.
              </p>
            </div>

            <button
              onClick={() => navigateTo('admin')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-stone-700 bg-white hover:bg-[#f6eee4] border border-[#ded0bf] shadow-sm transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-800" />
              <span>Add / Edit Rulings</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.projects.map((proj) => (
              <div
                key={proj.id}
                className="beige-card rounded-2xl overflow-hidden flex flex-col group border border-[#e8dfd5] hover:border-[#cbb497] transition-all"
              >
                <div className="relative h-48 w-full bg-[#f4ede3] overflow-hidden">
                  <img
                    src={proj.imageUrl || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800"}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800";
                    }}
                  />
                  <div className="absolute inset-0 bg-stone-900/15" />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors judicial-heading">
                      {proj.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.techStack?.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 text-[11px] font-semibold rounded bg-[#f4ede3] text-stone-800 border border-[#e4d8c7]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 pt-3 border-t border-[#e8dfd5]">
                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-700"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Ruling Archive</span>
                        </a>
                      )}
                      {proj.githubUrl && (
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Case Summary</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* SKILLS & JURISPRUDENCE SECTION */}
      {/* ============================================================ */}
      <section id="skills" className="py-24 border-t border-[#e8dfd5] bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-900">
              <Layers className="w-4 h-4 text-amber-800" />
              <span>Jurisprudential Fields</span>
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight judicial-heading">
              Legal Domains & Judicial Competencies
            </h3>
            <p className="text-stone-600 text-sm sm:text-base">
              Core statutory expertise, trial adjudication control, dispute resolution, and scholarly research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.skills.map((group, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#e8dfd5] hover:border-[#cbb497] transition-all shadow-sm"
              >
                <h4 className="text-sm font-bold uppercase tracking-wider text-amber-900 mb-4 pb-2 border-b border-[#e8dfd5] flex items-center justify-between judicial-heading">
                  <span>{group.category}</span>
                  <span className="text-xs text-stone-400 font-mono">({group.items.length})</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1 text-xs font-semibold rounded-lg bg-[#f6eee4] text-stone-800 border border-[#e4d8c7] hover:border-amber-700 hover:bg-white transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CONTACT SECTION */}
      {/* ============================================================ */}
      <section id="contact" className="py-24 border-t border-[#e8dfd5] bg-[#f5ece1]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-900">
                <Mail className="w-4 h-4 text-amber-800" />
                <span>Chambers Registry</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight judicial-heading">
                Judicial Correspondence & Arbitral Inquiries
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                For official institutional communications, arbitral tribunal nominations, legal symposia, or judicial inquiries, please communicate directly with Judge Mariam Awad's Chambers.
              </p>

              <div className="space-y-4 pt-4">
                <a
                  href={`mailto:${data.profile.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#ded0bf] hover:border-amber-700 transition-colors text-stone-700 hover:text-stone-900 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center border border-amber-300">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-stone-500 uppercase font-bold">Chambers Official Email</div>
                    <div className="text-sm font-bold text-stone-900 font-mono">{data.profile.email}</div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-[#ded0bf] text-stone-700 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-[#efe6d8] text-amber-950 flex items-center justify-center border border-[#dfd2c0]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-stone-500 uppercase font-bold">Court & Registry Location</div>
                    <div className="text-sm font-bold text-stone-900">{data.profile.location}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Form */}
            <div className="lg:col-span-7">
              <div className="p-8 rounded-2xl bg-white border border-[#ded0bf] shadow-md">
                <h4 className="text-lg font-bold text-stone-900 mb-6 judicial-heading">
                  Submit Formal Inquiry
                </h4>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        Full Name & Title
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="e.g. Counselor Ahmed Soliman"
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                        Official / Professional Email
                      </label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="counselor@firm.org"
                        className="w-full px-4 py-3 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      Inquiry / Case Brief
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Specify the nature of your inquiry, arbitral invitation, or communication..."
                      className="w-full px-4 py-3 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-amber-800 to-yellow-900 hover:from-amber-700 hover:to-yellow-800 shadow-md transition-all disabled:opacity-50"
                  >
                    {isSending ? (
                      <span>Submitting to Chambers...</span>
                    ) : (
                      <>
                        <span>Submit Correspondence</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
