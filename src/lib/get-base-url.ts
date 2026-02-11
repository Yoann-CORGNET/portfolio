export function getBaseUrl(): string {

  // Custom domain URL
  if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;

  if (process.env.NEXT_PUBLIC_APP_URL) 
    return process.env.NEXT_PUBLIC_APP_URL;
  
  // Default Vercel generated deployment URL
  if (process.env.NEXT_PUBLIC_VERCEL_URL) 
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  
  return "http://localhost:3000";
}
