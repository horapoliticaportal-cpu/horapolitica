import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    '192.168.1.8',
    '172.26.0.240',
    '192.168.0.97',
    'unwired-shamrock-snowflake.ngrok-free.dev'
  ],
};

export default nextConfig;