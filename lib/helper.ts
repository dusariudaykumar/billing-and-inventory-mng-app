export function getFromLocalStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem(key);
  }
  return null;
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}

export const appendQueryParams = (url: string, params: Record<string, any>) => {
  const getSeparator = () => {
    const hasQueryParams = url.includes('?');
    return hasQueryParams ? '&' : '?';
  };

  if (params?.page) {
    url += `${getSeparator()}page=${params.page}`;
  }
  if (params?.limit) {
    url += `${getSeparator()}limit=${params.limit}`;
  }
  if (params?.search) {
    url += `${getSeparator()}search=${params.search}`;
  }

  return url;
};
