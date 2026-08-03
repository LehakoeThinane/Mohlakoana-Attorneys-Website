import type { NextConfig } from "next";

// CloudLinux's Node Selector (cPanel) forces node_modules to be a symlink
// into a sibling ~/nodevenv/... directory, outside this project's own
// folder. Turbopack refuses to resolve through a symlink that points
// outside what it considers the project root unless told otherwise via
// turbopack.root. Only set in production (via the TURBOPACK_ROOT env var
// on the server) — locally there's no such symlink, so the default
// auto-detected root is correct and this stays unset.
// Shared hosting (CloudLinux LVE) caps how many processes an account can
// have running at once. Next.js's build spawns a worker per CPU core by
// default for static generation, which can exceed that cap and fail with
// spawn EAGAIN. experimental.cpus overrides the worker count; set via
// NEXT_BUILD_WORKERS on the server, left at Next's own default locally.
const nextConfig: NextConfig = {
  // Temporary escape hatch: builds a plain static export (no Node server
  // required) so the marketing site can go live while the CloudLinux Node
  // Selector / LiteSpeed integration on the host is broken. The portal route
  // group must be physically absent from src/app for this build (static
  // export can't include /portal/matters/[id] or Server Actions), and
  // contact/page.tsx swaps in a static fallback instead of the form. Unset
  // once the Node app is actually running again.
  ...(process.env.STATIC_EXPORT === "1" ? { output: "export" } : {}),
  ...(process.env.TURBOPACK_ROOT ? { turbopack: { root: process.env.TURBOPACK_ROOT } } : {}),
  ...(process.env.NEXT_BUILD_WORKERS
    ? { experimental: { cpus: Number(process.env.NEXT_BUILD_WORKERS) } }
    : {}),
};

export default nextConfig;
