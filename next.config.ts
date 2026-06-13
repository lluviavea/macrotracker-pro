import type { NextConfig } from "next";
import withNextIntl from "next-intl/plugin";
import { networkInterfaces } from "os";

function getLocalNetworkOrigins(): string[] {
  const origins = new Set<string>(["localhost", "127.0.0.1"]);
  const interfaces = networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        origins.add(net.address);
      }
    }
  }
  return Array.from(origins);
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getLocalNetworkOrigins(),
};

export default withNextIntl("./i18n/request.ts")(nextConfig);
