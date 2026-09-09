import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEFAULT_PORTFOLIO_DATA } from '../data/defaultData';

const STORAGE_KEY = 'mariam_awad_judge_data_v4';

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.profile?.title && !parsed.profile.title.includes('Software') && !parsed.profile.title.includes('Developer')) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading data from localStorage', e);
    }
    return DEFAULT_PORTFOLIO_DATA;
  });

  // Current view: 'portfolio' or 'admin'
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return 'admin';
    }
    return 'portfolio';
  });

  // Active certificate modal for full-screen inspection
  const [activeModalCert, setActiveModalCert] = useState(null);

  // Certificate currently being edited in the admin panel
  const [editingCertId, setEditingCertId] = useState(null);

  // Toast system
  const [toast, setToast] = useState(null);

  // Synchronize hash with view
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('portfolio');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view) => {
    setCurrentView(view);
    if (view === 'admin') {
      window.location.hash = 'admin';
    } else {
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage (quota exceeded?)', e);
      showToast('Storage warning: Data might be too large for browser local cache.', 'error');
    }
  }, [data]);

  // Profile methods
  const updateProfile = (profileUpdates) => {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profileUpdates
      }
    }));
    showToast('Profile information updated successfully!');
  };

  // Certificate methods
  const addCertificate = (newCert) => {
    const certWithId = {
      ...newCert,
      id: newCert.id || `cert-${Date.now()}`
    };
    setData((prev) => ({
      ...prev,
      certificates: [certWithId, ...prev.certificates]
    }));
    showToast(`Added certificate: "${newCert.title}"`);
    return certWithId;
  };

  const updateCertificate = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      certificates: prev.certificates.map((cert) =>
        cert.id === id ? { ...cert, ...updatedFields } : cert
      )
    }));
    showToast('Certificate saved successfully!');
  };

  const deleteCertificate = (id) => {
    const target = data.certificates.find((c) => c.id === id);
    setData((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((c) => c.id !== id)
    }));
    if (editingCertId === id) {
      setEditingCertId(null);
    }
    showToast(`Removed certificate: "${target?.title || id}"`, 'info');
  };

  const refreshCertificates = () => {
    // Re-orders / touches certificates to trigger a fresh re-render and timestamp
    setData((prev) => ({
      ...prev,
      certificates: [...prev.certificates]
    }));
    showToast('Certificates refreshed successfully!');
  };

  // Project methods
  const addProject = (newProject) => {
    const projectWithId = {
      ...newProject,
      id: newProject.id || `proj-${Date.now()}`
    };
    setData((prev) => ({
      ...prev,
      projects: [projectWithId, ...prev.projects]
    }));
    showToast(`Added project: "${newProject.title}"`);
    return projectWithId;
  };

  const updateProject = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, ...updatedFields } : proj
      )
    }));
    showToast('Project updated successfully!');
  };

  const deleteProject = (id) => {
    const target = data.projects.find((p) => p.id === id);
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id)
    }));
    showToast(`Removed project: "${target?.title || id}"`, 'info');
  };

  // Skills & Experience
  const updateSkills = (newSkills) => {
    setData((prev) => ({
      ...prev,
      skills: newSkills
    }));
    showToast('Skills catalog updated!');
  };

  const updateExperience = (newExperience) => {
    setData((prev) => ({
      ...prev,
      experience: newExperience
    }));
    showToast('Work experience updated!');
  };

  // Reset to default
  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset all portfolio data to default? Any unsaved edits will be replaced.')) {
      setData(DEFAULT_PORTFOLIO_DATA);
      localStorage.removeItem(STORAGE_KEY);
      showToast('Restored default portfolio data!', 'info');
    }
  };

  // Export JSON backup file
  const exportDataJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `mariam_awad_portfolio_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Portfolio JSON backup downloaded successfully!');
    } catch (e) {
      console.error(e);
      showToast('Failed to export backup.', 'error');
    }
  };

  // Import JSON backup file
  const importDataJSON = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.profile && parsed.certificates) {
          setData(parsed);
          showToast('Portfolio data restored from JSON backup!');
        } else {
          showToast('Invalid backup file structure.', 'error');
        }
      } catch (err) {
        showToast('Error reading JSON file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        currentView,
        navigateTo,
        activeModalCert,
        setActiveModalCert,
        editingCertId,
        setEditingCertId,
        toast,
        showToast,
        updateProfile,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        refreshCertificates,
        addProject,
        updateProject,
        deleteProject,
        updateSkills,
        updateExperience,
        resetToDefault,
        exportDataJSON,
        importDataJSON
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
