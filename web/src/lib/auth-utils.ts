// lib/auth-utils.ts
export function clearAllAuthStorage() {
  // Clear all cookies
  document.cookie.split(";").forEach(function(c) {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  
  // Clear localStorage
  localStorage.clear();
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear NextAuth specific storage
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('nextauth') || key.includes('auth')) {
        localStorage.removeItem(key);
      }
    });
  }
}