import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN IPs and 127.0.0.1 to talk to dev resources (HMR, RSC)
  allowedDevOrigins: ["127.0.0.1", "192.168.31.143"],
};

export default nextConfig;
