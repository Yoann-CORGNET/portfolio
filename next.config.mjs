/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // pino resolves its transports (thread-stream, pino-pretty, ...) with
  // dynamic requires; webpack tries to statically follow them anyway and
  // fails on the optional ones that aren't installed. Kept external, it's
  // just required at runtime by Node like any other server-only package.
  serverExternalPackages: ["pino"],
};

export default nextConfig;
