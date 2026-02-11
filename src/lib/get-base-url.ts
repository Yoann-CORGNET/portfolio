export function getBaseUrl() {
  // Browser -> use relative path
  if (typeof window !== "undefined") {
    return ""
  }

  // Vercel (production || preview)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // Local development
  return "http://localhost:3000"
}
