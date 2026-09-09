import React, { useState, useRef, useEffect } from 'react';
import {
  Award,
  User,
  Briefcase,
  Layers,
  Upload,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  Save,
  Check,
  ArrowLeft,
  Download,
  FileCode,
  RotateCcw,
  Search,
  Scale,
  Gavel,
  BookOpen
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const AdminPage = () => {
  const {
    data,
    navigateTo,
    updateProfile,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    refreshCertificates,
    addProject,
    updateProject,
    deleteProject,
    updateSkills,
    resetToDefault,
    exportDataJSON,
    importDataJSON,
    editingCertId,
    setEditingCertId,
    showToast
  } = usePortfolio();

  // Active tab in admin
  const [activeTab, setActiveTab] = useState('certificates');

  // Search in certificates
  const [certSearch, setCertSearch] = useState('');

  // ----------------------------------------------------
  // CERTIFICATE FORM STATE
  // ----------------------------------------------------
  const [isAddingCert, setIsAddingCert] = useState(false);
  const [certFormData, setCertFormData] = useState({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    imageUrl: '',
    description: '',
    skills: '',
    featured: true
  });

  const certFileInputRef = useRef(null);
  const avatarFileInputRef = useRef(null);
  const projectFileInputRef = useRef(null);

  useEffect(() => {
    if (editingCertId) {
      const target = data.certificates.find((c) => c.id === editingCertId);
      if (target) {
        setCertFormData({
          title: target.title || '',
          issuer: target.issuer || '',
          issueDate: target.issueDate || '',
          expiryDate: target.expiryDate || '',
          credentialId: target.credentialId || '',
          credentialUrl: target.credentialUrl || '',
          imageUrl: target.imageUrl || '',
          description: target.description || '',
          skills: target.skills ? target.skills.join(', ') : '',
          featured: target.featured ?? true
        });
        setIsAddingCert(false);
        setActiveTab('certificates');
      }
    }
  }, [editingCertId, data.certificates]);

  // Handle Certificate Image File Upload
  const handleCertImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      showToast('Image is larger than 2.5MB. Please choose a smaller image for fast loading.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCertFormData((prev) => ({ ...prev, imageUrl: event.target.result }));
      showToast('Judicial diploma document uploaded successfully!');
    };
    reader.readAsDataURL(file);
  };

  const startNewCert = () => {
    setEditingCertId(null);
    setCertFormData({
      title: '',
      issuer: '',
      issueDate: 'October 2024',
      expiryDate: 'Permanent Appointment',
      credentialId: '',
      credentialUrl: '',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800',
      description: '',
      skills: 'Commercial Arbitration, Civil Law, Judicial Ethics',
      featured: true
    });
    setIsAddingCert(true);
  };

  const handleSaveCert = (e) => {
    e.preventDefault();
    if (!certFormData.title.trim() || !certFormData.issuer.trim()) {
      showToast('Accreditation Title and Issuing Body are required.', 'error');
      return;
    }

    const parsedSkills = certFormData.skills
      ? certFormData.skills.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      title: certFormData.title.trim(),
      issuer: certFormData.issuer.trim(),
      issueDate: certFormData.issueDate.trim() || '2024',
      expiryDate: certFormData.expiryDate.trim(),
      credentialId: certFormData.credentialId.trim(),
      credentialUrl: certFormData.credentialUrl.trim(),
      imageUrl: certFormData.imageUrl.trim() || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
      description: certFormData.description.trim(),
      skills: parsedSkills,
      featured: certFormData.featured
    };

    if (editingCertId) {
      updateCertificate(editingCertId, payload);
    } else {
      addCertificate(payload);
    }

    setEditingCertId(null);
    setIsAddingCert(false);
  };

  const handleCancelCertEdit = () => {
    setEditingCertId(null);
    setIsAddingCert(false);
  };

  // ----------------------------------------------------
  // PROFILE STATE & UPLOAD
  // ----------------------------------------------------
  const [profileForm, setProfileForm] = useState(data.profile);

  useEffect(() => {
    setProfileForm(data.profile);
  }, [data.profile]);

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      showToast('Image is larger than 2.5MB. Please choose a smaller image.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target.result;
      setProfileForm((prev) => ({ ...prev, avatarUrl: base64 }));
      updateProfile({ avatarUrl: base64 });
      showToast('Judge portrait photo updated and saved!');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  // ----------------------------------------------------
  // RULINGS / CASES FORM
  // ----------------------------------------------------
  const [editingProjId, setEditingProjId] = useState(null);
  const [isAddingProj, setIsAddingProj] = useState(false);
  const [projFormData, setProjFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    liveUrl: '',
    githubUrl: '',
    imageUrl: ''
  });

  const startNewProject = () => {
    setEditingProjId(null);
    setProjFormData({
      title: '',
      description: '',
      techStack: 'Commercial Law, Contractual Breach, Civil Precedent',
      liveUrl: '',
      githubUrl: '',
      imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800'
    });
    setIsAddingProj(true);
  };

  const handleEditProjectClick = (proj) => {
    setEditingProjId(proj.id);
    setIsAddingProj(false);
    setProjFormData({
      title: proj.title || '',
      description: proj.description || '',
      techStack: proj.techStack ? proj.techStack.join(', ') : '',
      liveUrl: proj.liveUrl || '',
      githubUrl: proj.githubUrl || '',
      imageUrl: proj.imageUrl || ''
    });
  };

  const handleProjectImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setProjFormData((prev) => ({ ...prev, imageUrl: event.target.result }));
      showToast('Ruling document screenshot uploaded!');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projFormData.title.trim()) {
      showToast('Ruling / Publication title is required.', 'error');
      return;
    }

    const parsedTech = projFormData.techStack
      ? projFormData.techStack.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      title: projFormData.title.trim(),
      description: projFormData.description.trim(),
      techStack: parsedTech,
      liveUrl: projFormData.liveUrl.trim(),
      githubUrl: projFormData.githubUrl.trim(),
      imageUrl: projFormData.imageUrl.trim() || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800'
    };

    if (editingProjId) {
      updateProject(editingProjId, payload);
    } else {
      addProject(payload);
    }

    setEditingProjId(null);
    setIsAddingProj(false);
  };

  // ----------------------------------------------------
  // SKILLS / JURISPRUDENCE
  // ----------------------------------------------------
  const [skillsCatalog, setSkillsCatalog] = useState(data.skills);

  useEffect(() => {
    setSkillsCatalog(data.skills);
  }, [data.skills]);

  const handleSkillChange = (catIndex, value) => {
    const updated = [...skillsCatalog];
    updated[catIndex].items = value.split(',').map((s) => s.trim()).filter(Boolean);
    setSkillsCatalog(updated);
  };

  const handleSaveSkills = () => {
    updateSkills(skillsCatalog);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-stone-800 pb-24">
      {/* Top Banner & Navigation Back */}
      <div className="border-b border-[#e8dfd5] bg-[#faf7f2]/90 backdrop-blur-md sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4">
            <div className="flex items-center gap-3.5">
              <button
                onClick={() => navigateTo('portfolio')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f6eee4] text-stone-700 hover:text-stone-950 border border-[#ded0bf] transition-colors text-xs font-bold shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Showcase</span>
              </button>
              <div className="h-4 w-px bg-[#dfd2c0] hidden sm:block" />
              <div>
                <h1 className="text-lg font-bold text-stone-900 flex items-center gap-2 judicial-heading">
                  <span>Judicial Chambers Management Portal</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                    Judge Portal
                  </span>
                </h1>
                <p className="text-xs text-stone-500 font-medium">
                  Update judicial accreditations, robe portrait, rulings, and legal domains in real-time
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={exportDataJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f6eee4] text-stone-700 hover:text-stone-900 border border-[#ded0bf] transition-colors text-xs font-semibold shadow-sm"
                title="Download JSON backup"
              >
                <Download className="w-3.5 h-3.5 text-amber-800" />
                <span>Backup JSON</span>
              </button>
              <button
                onClick={() => navigateTo('portfolio')}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white transition-colors text-xs font-bold shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>View Live Site</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-[#e8dfd5]">
            <button
              onClick={() => setActiveTab('certificates')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'certificates'
                  ? 'border-amber-800 text-amber-900 bg-amber-100/50'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Award className="w-4 h-4 text-amber-800" />
              <span>Accreditations ({data.certificates.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'profile'
                  ? 'border-amber-800 text-amber-900 bg-amber-100/50'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <User className="w-4 h-4 text-amber-800" />
              <span>Judge Profile & Photo</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'projects'
                  ? 'border-amber-800 text-amber-900 bg-amber-100/50'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Gavel className="w-4 h-4 text-amber-800" />
              <span>Landmark Rulings ({data.projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('skills')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'skills'
                  ? 'border-amber-800 text-amber-900 bg-amber-100/50'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-800" />
              <span>Legal Jurisprudence</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'backup'
                  ? 'border-amber-800 text-amber-900 bg-amber-100/50'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileCode className="w-4 h-4 text-amber-800" />
              <span>Backup & Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: CERTIFICATES / ACCREDITATIONS HUB */}
      {/* ============================================================ */}
      {activeTab === 'certificates' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Certificates List & Search */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 judicial-heading">Judicial Accreditations Catalog</h2>
                  <p className="text-xs text-stone-500">
                    Click any accreditation card to modify its details immediately.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={refreshCertificates}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#f6eee4] text-stone-700 text-xs font-semibold border border-[#ded0bf] transition-colors shadow-sm"
                    title="Refresh list"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-800" />
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={startNewCert}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Accreditation</span>
                  </button>
                </div>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={certSearch}
                  onChange={(e) => setCertSearch(e.target.value)}
                  placeholder="Filter accreditations by title or institution..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-[#ded0bf] text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 shadow-sm"
                />
              </div>

              {/* Clickable Certificate Cards */}
              <div className="space-y-3">
                {data.certificates
                  .filter(
                    (c) =>
                      c.title.toLowerCase().includes(certSearch.toLowerCase()) ||
                      c.issuer.toLowerCase().includes(certSearch.toLowerCase())
                  )
                  .map((cert) => {
                    const isSelected = (editingCertId === cert.id) && !isAddingCert;
                    return (
                      <div
                        key={cert.id}
                        onClick={() => {
                          setEditingCertId(cert.id);
                          setIsAddingCert(false);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                          isSelected
                            ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-700/20 shadow-md'
                            : 'bg-white border-[#ded0bf] hover:border-amber-600 hover:bg-[#fcfaf7] shadow-sm'
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Thumbnail */}
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f4ede3] shrink-0 border border-[#e4d8c7]">
                            <img
                              src={cert.imageUrl || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800"}
                              alt={cert.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800";
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-amber-900 truncate">
                                {cert.issuer}
                              </span>
                              <span className="text-[10px] text-stone-500">
                                • {cert.issueDate}
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-stone-900 truncate group-hover:text-amber-800 transition-colors judicial-heading">
                              {cert.title}
                            </h3>
                            {cert.credentialId && (
                              <p className="text-[11px] text-stone-500 font-mono truncate">
                                Registry: {cert.credentialId}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCertId(cert.id);
                              setIsAddingCert(false);
                            }}
                            className="p-2 text-stone-500 hover:text-amber-800 hover:bg-white rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Delete credential "${cert.title}"?`)) {
                                deleteCertificate(cert.id);
                              }
                            }}
                            className="p-2 text-stone-400 hover:text-rose-700 hover:bg-white rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Right Column: Certificate Editor Form */}
            <div className="lg:col-span-6">
              <div className="p-6 rounded-2xl bg-white border border-[#ded0bf] sticky top-40 shadow-md">
                <div className="flex items-center justify-between pb-4 border-b border-[#e8dfd5] mb-6">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-lg bg-amber-100 text-amber-900 border border-amber-300">
                      <Scale className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-stone-900 judicial-heading">
                        {isAddingCert
                          ? 'Confer / Add New Accreditation'
                          : editingCertId
                          ? 'Edit Selected Credential'
                          : 'Select a Credential to Edit'}
                      </h3>
                      <p className="text-xs text-stone-500">
                        {editingCertId
                          ? 'Changes update the public portfolio instantly'
                          : 'Upload diploma document or enter registry details'}
                      </p>
                    </div>
                  </div>

                  {(editingCertId || isAddingCert) && (
                    <button
                      onClick={handleCancelCertEdit}
                      className="text-xs font-semibold text-stone-500 hover:text-stone-900"
                    >
                      Clear / Close
                    </button>
                  )}
                </div>

                {/* Form */}
                <form onSubmit={handleSaveCert} className="space-y-4">
                  {/* File Upload Box */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                      Accreditation Certificate File / Image
                    </label>
                    <div className="flex items-center gap-4">
                      {certFormData.imageUrl && (
                        <div className="w-20 h-16 rounded-xl overflow-hidden bg-[#f4ede3] border border-[#ded0bf] shrink-0">
                          <img
                            src={certFormData.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <input
                          type="file"
                          ref={certFileInputRef}
                          onChange={handleCertImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => certFileInputRef.current?.click()}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#cbb497] bg-[#fbf9f6] hover:bg-white text-xs font-semibold text-stone-700 transition-colors shadow-sm"
                        >
                          <Upload className="w-4 h-4 text-amber-800" />
                          <span>Upload File from Computer (JPG, PNG)</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Or image URL */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                      Or Document URL:
                    </label>
                    <input
                      type="text"
                      value={certFormData.imageUrl}
                      onChange={(e) =>
                        setCertFormData({ ...certFormData, imageUrl: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  {/* Title & Issuer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Credential / Fellowship Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={certFormData.title}
                        onChange={(e) =>
                          setCertFormData({ ...certFormData, title: e.target.value })
                        }
                        placeholder="e.g. CIArb Fellow (FCIArb)"
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Issuing Institution *
                      </label>
                      <input
                        type="text"
                        required
                        value={certFormData.issuer}
                        onChange={(e) =>
                          setCertFormData({ ...certFormData, issuer: e.target.value })
                        }
                        placeholder="e.g. CIArb, NIJS, Harvard Law"
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Date Conferred
                      </label>
                      <input
                        type="text"
                        value={certFormData.issueDate}
                        onChange={(e) =>
                          setCertFormData({ ...certFormData, issueDate: e.target.value })
                        }
                        placeholder="e.g. October 2022"
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Appointment Status
                      </label>
                      <input
                        type="text"
                        value={certFormData.expiryDate}
                        onChange={(e) =>
                          setCertFormData({ ...certFormData, expiryDate: e.target.value })
                        }
                        placeholder="e.g. Permanent / Life Appointment"
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>
                  </div>

                  {/* Credential ID & URL */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Roll / Registry Number
                      </label>
                      <input
                        type="text"
                        value={certFormData.credentialId}
                        onChange={(e) =>
                          setCertFormData({ ...certFormData, credentialId: e.target.value })
                        }
                        placeholder="e.g. CIARB-F-49021"
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Verification URL
                      </label>
                      <input
                        type="url"
                        value={certFormData.credentialUrl}
                        onChange={(e) =>
                          setCertFormData({ ...certFormData, credentialUrl: e.target.value })
                        }
                        placeholder="https://ciarb.org/verify/..."
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>
                  </div>

                  {/* Skills / Jurisprudence */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Legal Competencies (comma separated)
                    </label>
                    <input
                      type="text"
                      value={certFormData.skills}
                      onChange={(e) =>
                        setCertFormData({ ...certFormData, skills: e.target.value })
                      }
                      placeholder="Civil Jurisprudence, Arbitration, Statutory Interpretation"
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Official Description / Scope
                    </label>
                    <textarea
                      rows={3}
                      value={certFormData.description}
                      onChange={(e) =>
                        setCertFormData({ ...certFormData, description: e.target.value })
                      }
                      placeholder="Scope of evaluation, statutory coursework, or judicial fellowship scope..."
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-amber-800 hover:bg-amber-900 transition-all shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingCertId ? 'Save Accreditation' : 'Create Accreditation'}</span>
                    </button>

                    {(editingCertId || isAddingCert) && (
                      <button
                        type="button"
                        onClick={handleCancelCertEdit}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-700 hover:text-stone-950 bg-[#f4ece1] hover:bg-[#ebdccb] transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: PROFILE & PHOTO */}
      {/* ============================================================ */}
      {activeTab === 'profile' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="p-8 rounded-2xl bg-white border border-[#ded0bf] shadow-md space-y-8">
            <div>
              <h2 className="text-xl font-bold text-stone-900 judicial-heading">Judge Profile & Official Portrait</h2>
              <p className="text-xs text-stone-500">
                Manage your judicial title, portrait, biography, jurisdiction, and official contacts.
              </p>
            </div>

            {/* Headshot Upload Section */}
            <div className="p-6 rounded-2xl bg-[#fbf9f6] border border-[#e8dfd5] flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-amber-700/20 bg-[#f4ede3] shadow-md">
                  <img
                    src={profileForm.avatarUrl}
                    alt={profileForm.fullName}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600";
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3 text-center sm:text-left flex-1">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 judicial-heading">Official Portrait</h3>
                  <p className="text-xs text-stone-500">
                    Upload an official judicial portrait or high-resolution photo (PNG, JPG, WebP).
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <input
                    type="file"
                    ref={avatarFileInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => avatarFileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 transition-colors shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload New Photo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Fields Form */}
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Full Judicial Title & Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-sm text-stone-900 focus:outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Bench Appointment / Role
                  </label>
                  <input
                    type="text"
                    required
                    value={profileForm.title}
                    onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-sm text-stone-900 focus:outline-none focus:border-amber-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Tagline / Jurisprudential Motto
                </label>
                <input
                  type="text"
                  value={profileForm.tagline}
                  onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-sm text-stone-900 focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Judicial Biography (About the Judge)
                </label>
                <textarea
                  rows={4}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-sm text-stone-900 focus:outline-none focus:border-amber-700 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Court Jurisdiction & City
                  </label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-sm text-stone-900 focus:outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Chambers Official Email
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-sm text-stone-900 focus:outline-none focus:border-amber-700"
                  />
                </div>
              </div>

              {/* Social / Scholar Links */}
              <div className="pt-4 border-t border-[#e8dfd5] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Judicial & Professional Links
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">LinkedIn Profile</label>
                    <input
                      type="url"
                      value={profileForm.socials?.linkedin || ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, linkedin: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">Scholar / Archive Profile</label>
                    <input
                      type="url"
                      value={profileForm.socials?.github || ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          socials: { ...profileForm.socials, github: e.target.value }
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-amber-800 hover:bg-amber-900 transition-colors shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: LANDMARK RULINGS */}
      {/* ============================================================ */}
      {activeTab === 'projects' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 judicial-heading">Landmark Rulings & Precedents</h2>
                  <p className="text-xs text-stone-500">Manage case precedents and publications</p>
                </div>
                <button
                  onClick={startNewProject}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Ruling</span>
                </button>
              </div>

              <div className="space-y-3">
                {data.projects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => handleEditProjectClick(proj)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      editingProjId === proj.id
                        ? 'bg-amber-50/80 border-amber-600 ring-2 ring-amber-700/20'
                        : 'bg-white border-[#ded0bf] hover:border-amber-600'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#f4ede3] shrink-0 border border-[#e4d8c7]">
                        <img
                          src={proj.imageUrl}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800";
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-stone-900 truncate judicial-heading">{proj.title}</h3>
                        <p className="text-xs text-stone-500 truncate">{proj.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProjectClick(proj);
                        }}
                        className="p-2 text-stone-500 hover:text-amber-800 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Delete ruling "${proj.title}"?`)) {
                            deleteProject(proj.id);
                          }
                        }}
                        className="p-2 text-stone-400 hover:text-rose-700 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Editor Form */}
            <div className="lg:col-span-6">
              <div className="p-6 rounded-2xl bg-white border border-[#ded0bf] sticky top-40 shadow-md">
                <h3 className="text-base font-bold text-stone-900 mb-4 pb-3 border-b border-[#e8dfd5] judicial-heading">
                  {isAddingProj
                    ? 'Add New Landmark Ruling'
                    : editingProjId
                    ? 'Edit Landmark Ruling'
                    : 'Select a Ruling to Edit'}
                </h3>

                <form onSubmit={handleSaveProject} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Ruling / Case Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={projFormData.title}
                      onChange={(e) => setProjFormData({ ...projFormData, title: e.target.value })}
                      placeholder="e.g. Commercial Concession Precedent"
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Case Summary / Legal Holding
                    </label>
                    <textarea
                      rows={3}
                      value={projFormData.description}
                      onChange={(e) => setProjFormData({ ...projFormData, description: e.target.value })}
                      placeholder="Brief holding of the judgment..."
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Legal Principles Involved (comma separated)
                    </label>
                    <input
                      type="text"
                      value={projFormData.techStack}
                      onChange={(e) => setProjFormData({ ...projFormData, techStack: e.target.value })}
                      placeholder="Commercial Law, Civil Code, Contractual Breach"
                      className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Registry / Archive URL
                      </label>
                      <input
                        type="url"
                        value={projFormData.liveUrl}
                        onChange={(e) => setProjFormData({ ...projFormData, liveUrl: e.target.value })}
                        placeholder="https://chambers-archive.org/..."
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Case Report Link
                      </label>
                      <input
                        type="url"
                        value={projFormData.githubUrl}
                        onChange={(e) => setProjFormData({ ...projFormData, githubUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Ruling Image / Decree File
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={projectFileInputRef}
                        onChange={handleProjectImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => projectFileInputRef.current?.click()}
                        className="px-3 py-2 rounded-xl border border-dashed border-[#cbb497] text-xs font-semibold text-stone-700 hover:text-stone-900 flex items-center gap-1.5 bg-[#fbf9f6]"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-800" />
                        <span>Upload File</span>
                      </button>
                      <input
                        type="text"
                        value={projFormData.imageUrl}
                        onChange={(e) => setProjFormData({ ...projFormData, imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 rounded-xl bg-[#fbf9f6] border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-amber-800 hover:bg-amber-900 transition-colors shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingProjId ? 'Save Ruling' : 'Add Ruling'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: SKILLS / JURISPRUDENCE */}
      {/* ============================================================ */}
      {activeTab === 'skills' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="p-8 rounded-2xl bg-white border border-[#ded0bf] shadow-md space-y-6">
            <div>
              <h2 className="text-xl font-bold text-stone-900 judicial-heading">Legal Jurisprudence & Core Competencies</h2>
              <p className="text-xs text-stone-500">
                Edit items for each judicial domain (separated by commas).
              </p>
            </div>

            <div className="space-y-6">
              {skillsCatalog.map((cat, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-[#fbf9f6] border border-[#e8dfd5] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 uppercase tracking-wider judicial-heading">
                      {cat.category}
                    </span>
                    <span className="text-[11px] text-stone-500 font-mono">
                      {cat.items.length} competencies listed
                    </span>
                  </div>
                  <input
                    type="text"
                    value={cat.items.join(', ')}
                    onChange={(e) => handleSkillChange(idx, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#ded0bf] text-xs text-stone-900 focus:outline-none focus:border-amber-700 font-medium"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={handleSaveSkills}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-white bg-amber-800 hover:bg-amber-900 transition-colors shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save All Legal Domains</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: BACKUP & RESTORE */}
      {/* ============================================================ */}
      {activeTab === 'backup' && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="p-8 rounded-2xl bg-white border border-[#ded0bf] shadow-md space-y-8">
            <div>
              <h2 className="text-xl font-bold text-stone-900 judicial-heading">Chambers Data Backup & Archive</h2>
              <p className="text-xs text-stone-500">
                Export all judicial records and accreditations as a JSON file, or restore data anytime.
              </p>
            </div>

            {/* Export */}
            <div className="p-5 rounded-2xl bg-[#fbf9f6] border border-[#e8dfd5] flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 judicial-heading">Download Complete Archive (.json)</h3>
                <p className="text-xs text-stone-500">
                  Saves all judicial certificates, ruling records, portraits, and chambers details.
                </p>
              </div>
              <button
                onClick={exportDataJSON}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 transition-colors shrink-0 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export JSON</span>
              </button>
            </div>

            {/* Import */}
            <div className="p-5 rounded-2xl bg-[#fbf9f6] border border-[#e8dfd5] flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900 judicial-heading">Restore from Archive (.json)</h3>
                <p className="text-xs text-stone-500">
                  Upload a previously exported JSON backup file to restore records.
                </p>
              </div>
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-stone-800 bg-white hover:bg-[#f4ece1] border border-[#ded0bf] cursor-pointer transition-colors shrink-0 shadow-sm">
                <Upload className="w-4 h-4 text-amber-800" />
                <span>Upload JSON</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) importDataJSON(file);
                  }}
                />
              </label>
            </div>

            {/* Reset */}
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-rose-900">Reset to Default Judicial Template</h3>
                <p className="text-xs text-rose-700">
                  Revert all accreditations and profile details back to the default Judge Mariam Awad showcase.
                </p>
              </div>
              <button
                onClick={resetToDefault}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-800 bg-rose-100 hover:bg-rose-200 border border-rose-300 transition-colors shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset All</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
