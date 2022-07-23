const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "7s5okt",
  viewportHeight: 1250,
  viewportWidth: 1280,

  retries: {
    runMode: 1,
    openMode: 1,
  },

  env: {
    apiUrl: "https://heala-partners.netlify.app",
    mobileViewportWidthBreakpoint: 414,
    coverage: false,
    codeCoverage: {
      url: "https://heala-partners.netlify.app/__coverage__",
    },
  },

  chromeWebSecurity: false,
  experimentalStudio: true,

  component: {
    setupNodeEvents(on, config) {},
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
