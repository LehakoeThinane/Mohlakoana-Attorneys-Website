import type { NextConfig } from "next";

// CloudLinux's Node Selector (cPanel) forces node_modules to be a symlink
// into a sibling ~/nodevenv/... directory, outside this project's own
// folder. Turbopack refuses to resolve through a symlink that points
// outside what it considers the project root unless told otherwise via
// turbopack.root. Only set in production (via the TURBOPACK_ROOT env var
// on the server) — locally there's no such symlink, so the default
// auto-detected root is correct and this stays unset.
const nextConfig: NextConfig = {
  ...(process.env.TURBOPACK_ROOT ? { turbopack: { root: process.env.TURBOPACK_ROOT } } : {}),
};

export default nextConfig;
