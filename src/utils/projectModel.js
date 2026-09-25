/**
 * KMA Wedding & Media Production
 * Generic Project & Multi-Media Normalization and Utility Layer
 *
 * Ensures backward compatibility with legacy single-media records
 * (imageUrl / videoUrl) while establishing the production-ready
 * Project -> ProjectMedia[] parent-child architecture.
 */

/**
 * Determine whether a URL or string represents a video resource.
 * @param {string} url
 * @returns {boolean}
 */
export function isVideoResource(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.includes('drive.google.com') ||
    trimmed.includes('youtube.com') ||
    trimmed.includes('youtu.be') ||
    trimmed.includes('vimeo.com') ||
    trimmed.includes('dropbox.com') ||
    trimmed.endsWith('.mp4') ||
    trimmed.endsWith('.webm') ||
    trimmed.endsWith('.mov') ||
    trimmed.endsWith('.mkv') ||
    trimmed.startsWith('data:video/')
  ) {
    return true;
  }
  return false;
}

/**
 * Creates a normalized media item.
 * @param {Object} params
 * @param {string} [params.id]
 * @param {'image'|'video'} [params.type]
 * @param {string} params.url
 * @param {string} [params.thumbnailUrl]
 * @param {string} [params.title]
 * @param {number} [params.sortOrder]
 * @returns {Object}
 */
export function createMediaItem({
  id,
  type,
  url = '',
  thumbnailUrl = '',
  title = '',
  sortOrder = 0
}) {
  const cleanUrl = typeof url === 'string' ? url.trim() : '';
  const resolvedType = type || (isVideoResource(cleanUrl) ? 'video' : 'image');

  return {
    id: id || `media-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    type: resolvedType,
    url: cleanUrl,
    thumbnailUrl: thumbnailUrl || (resolvedType === 'image' ? cleanUrl : ''),
    title: title || '',
    sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
    createdAt: new Date().toISOString()
  };
}

/**
 * Normalizes an individual project object to ensure it strictly conforms
 * to the generic Project + ProjectMedia[] schema.
 *
 * Fully backward-compatible: Converts legacy `imageUrl` and `videoUrl` into `media[]` items
 * without loss of existing data or metadata.
 *
 * @param {Object} rawProject
 * @returns {Object} Normalized Project
 */
export function normalizeProject(rawProject) {
  if (!rawProject || typeof rawProject !== 'object') {
    return null;
  }

  const project = { ...rawProject };

  // Ensure stable ID
  project.id = project.id || `proj-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  // Default title & category
  project.title = project.title || 'Untitled Project';
  project.category = project.category || 'weddings';
  project.categoryLabel = project.categoryLabel || 'Cinematic Showcase';

  // Build/Normalize media array
  let normalizedMedia = [];

  if (Array.isArray(project.media) && project.media.length > 0) {
    normalizedMedia = project.media
      .filter((m) => m && (m.url || m.imageUrl || m.videoUrl))
      .map((m, idx) => {
        const itemUrl = (m.url || m.imageUrl || m.videoUrl || '').trim();
        const detectedType = m.type || (isVideoResource(itemUrl) ? 'video' : 'image');
        return {
          id: m.id || `media-${project.id}-${idx}`,
          type: detectedType,
          url: itemUrl,
          thumbnailUrl: m.thumbnailUrl || (detectedType === 'image' ? itemUrl : ''),
          title: m.title || '',
          sortOrder: typeof m.sortOrder === 'number' ? m.sortOrder : idx
        };
      })
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } else {
    // Migrate legacy imageUrl and videoUrl if present
    const legacyMedia = [];
    if (project.imageUrl && typeof project.imageUrl === 'string' && project.imageUrl.trim()) {
      legacyMedia.push(
        createMediaItem({
          id: `media-${project.id}-cover-img`,
          type: 'image',
          url: project.imageUrl.trim(),
          thumbnailUrl: project.imageUrl.trim(),
          title: 'Cover Image',
          sortOrder: 0
        })
      );
    }

    if (project.videoUrl && typeof project.videoUrl === 'string' && project.videoUrl.trim()) {
      legacyMedia.push(
        createMediaItem({
          id: `media-${project.id}-primary-vid`,
          type: 'video',
          url: project.videoUrl.trim(),
          thumbnailUrl: project.imageUrl || '',
          title: 'Featured Film',
          sortOrder: legacyMedia.length
        })
      );
    }

    normalizedMedia = legacyMedia;
  }

  project.media = normalizedMedia;

  // Resolve Cover Media
  let activeCover = null;
  if (project.coverMediaId) {
    activeCover = normalizedMedia.find((m) => m.id === project.coverMediaId);
  }

  if (!activeCover) {
    // Default cover to the first image or first media item
    activeCover =
      normalizedMedia.find((m) => m.type === 'image') ||
      normalizedMedia[0] ||
      null;
  }

  project.coverMediaId = activeCover?.id || null;

  // Maintain backward-compatible fallback fields on project root
  const primaryImage =
    activeCover?.type === 'image'
      ? activeCover
      : normalizedMedia.find((m) => m.type === 'image');

  const primaryVideo = normalizedMedia.find((m) => m.type === 'video');

  project.imageUrl =
    primaryImage?.url ||
    project.imageUrl ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800';

  project.videoUrl = primaryVideo?.url || project.videoUrl || '';

  // Generic and legacy metadata safe preservation
  project.year = project.year || new Date().getFullYear().toString();
  project.date = project.date || project.year;
  project.location = project.location || project.tribunal || 'Cairo, Egypt';
  project.tribunal = project.tribunal || project.location; // legacy mirror
  project.client = project.client || project.clientType || '';
  project.clientType = project.clientType || project.client; // legacy mirror
  project.value = project.value || 'VIP Production Package';
  project.description = project.description || '';
  project.outcome = project.outcome || '';
  project.techStack = Array.isArray(project.techStack)
    ? project.techStack
    : typeof project.techStack === 'string'
    ? project.techStack.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  project.liveUrl = project.liveUrl || '';
  project.githubUrl = project.githubUrl || '';
  project.status = project.status || 'published';
  project.createdAt = project.createdAt || new Date().toISOString();
  project.updatedAt = project.updatedAt || project.createdAt;

  return project;
}

/**
 * Returns the primary cover media item for a project.
 * @param {Object} project
 * @returns {Object|null}
 */
export function getProjectCover(project) {
  if (!project) return null;
  const normalized = project.media ? project : normalizeProject(project);
  if (!normalized || !Array.isArray(normalized.media) || normalized.media.length === 0) {
    return {
      id: 'default-cover',
      type: 'image',
      url:
        normalized?.imageUrl ||
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
      thumbnailUrl:
        normalized?.imageUrl ||
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
    };
  }

  if (normalized.coverMediaId) {
    const found = normalized.media.find((m) => m.id === normalized.coverMediaId);
    if (found) return found;
  }

  const firstImg = normalized.media.find((m) => m.type === 'image');
  return firstImg || normalized.media[0];
}

/**
 * Normalizes all projects in a portfolio data object.
 * Safe and non-destructive: keeps all other properties intact.
 *
 * @param {Object} portfolioData
 * @returns {Object}
 */
export function normalizePortfolioData(portfolioData) {
  if (!portfolioData || typeof portfolioData !== 'object') {
    return portfolioData;
  }

  const rawProjects = Array.isArray(portfolioData.projects) ? portfolioData.projects : [];
  const normalizedProjects = rawProjects
    .map(normalizeProject)
    .filter(Boolean);

  const servicesList = Array.isArray(portfolioData.services) && portfolioData.services.length > 0
    ? portfolioData.services
    : (Array.isArray(portfolioData.practiceAreas) ? portfolioData.practiceAreas : []);

  return {
    ...portfolioData,
    projects: normalizedProjects,
    practiceAreas: servicesList,
    services: servicesList
  };
}
