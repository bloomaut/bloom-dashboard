/* eslint-disable @typescript-eslint/no-var-requires */
const withNextIntl = require("next-intl/plugin")();

module.exports = withNextIntl({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
});
