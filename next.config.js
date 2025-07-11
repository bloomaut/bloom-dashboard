/* eslint-disable @typescript-eslint/no-var-requires */
const withNextIntl = require("next-intl/plugin")();
const path = require("path");

module.exports = withNextIntl({
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
    prependData: `@import "theme.scss";`,
  },
});
