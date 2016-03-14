exports.config = {
  seleniumAddress: 'http://127.0.0.1:4444/wd/hub',
  allScriptsTimeout: 100000,
  specs: [
    'e2e/*.js'
  ],
  capabilities: {
    'browserName': 'chrome'
  },

  chromeOnly: true,
  baseUrl: 'http://localhost:3001',
  framework: 'jasmine'
};
