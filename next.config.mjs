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
  // A scanned QR code opens a URL in the phone's browser, which previews a
  // PDF instead of saving it — the `download` attribute on the linktree row
  // only exists for a click. `attachment` is what makes the scan download.
  async headers() {
    return [
      {
        source: "/Yoann-CORGNET_CV.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: 'attachment; filename="Yoann-CORGNET_CV.pdf"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
