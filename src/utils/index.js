export function createPageUrl(basePath, params = {}) {
    if (!params || Object.keys(params).length === 0) {
      return basePath;
    }
  
    const query = new URLSearchParams(params).toString();
    return `${basePath}?${query}`;
  }
  