/**
 * KMA Wedding & Media Production
 * Centralized API Client Layer
 *
 * Provides a clean boundary between React frontend components/context
 * and backend REST endpoints.
 */

const API_BASE = import.meta.env?.VITE_API_URL || '';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic request helper with timeout and clean JSON handling.
 * @param {string} endpoint
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
export async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  // Default timeout of 8 seconds if no external signal provided
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  const signal = options.signal || controller.signal;

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {})
  };

  const config = {
    credentials: 'include', // transport secure HTTP-only cookies
    ...options,
    headers,
    signal
  };

  try {
    const res = await fetch(url, config);
    clearTimeout(timeoutId);

    let json = null;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      json = await res.json();
    }

    if (!res.ok) {
      const errorMsg = json?.message || json?.error || `HTTP error ${res.status}`;
      throw new ApiError(errorMsg, res.status, json);
    }

    return json;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof ApiError) {
      throw err;
    }
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your connection.', 408, null);
    }
    // Network or offline error
    throw new ApiError(err.message || 'Network request failed', 0, null);
  }
}

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options) => {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return request(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body)
    });
  },
  put: (endpoint, body, options) => {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return request(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? body : JSON.stringify(body)
    });
  },
  patch: (endpoint, body, options) =>
    request(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint, options) => request(endpoint, { ...options, method: 'DELETE' }),
  upload: (endpoint, formData, options) =>
    request(endpoint, { ...options, method: 'POST', body: formData })
};
