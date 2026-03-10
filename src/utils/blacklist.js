const BANNED_BASE64 = [
  'YWRtaW4=',
  'bW9k',
  'c3lzdGVt',
  'c2FtZXQ=',
  'bnl4',
  'aGVtZXJh',
];

const toBase64 = (value = '') => {
  try {
    return btoa(value);
  } catch {
    return '';
  }
};

export const isUsernameBanned = (username = '') => {
  const normalized = String(username).trim().toLowerCase();
  if (!normalized) return false;
  return BANNED_BASE64.includes(toBase64(normalized));
};

export { BANNED_BASE64 };
