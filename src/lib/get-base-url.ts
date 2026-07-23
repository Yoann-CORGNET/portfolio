export function getBaseUrl() {
  // Browser -> use relative path
  if (typeof window !== "undefined") {
    return "";
  }

  // Custom domain name
  if (process.env.APP_URL) {
    return `https://${process.env.APP_URL}`;
  }

  // Vercel auto generated (production || preview)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Local development
  return "http://localhost:3000";
}
