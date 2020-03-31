'use strict';

const PKG = require('../package.json');

// Expose the git hash for fingerprinting and error logging
const git = require('git-rev-sync');
const gitBranch = git.branch();
const gitRevision = git.short();

// The Rails API namespace
const apiNamespace = 'v1/admin';

// Where the Rails backend is located
const apiHosts = {
  development: 'http://localhost:3000',
  production: 'https://api.interflux.com'
};

// Where this Ember app is located
const appHosts = {
  development: 'http://localhost:4300',
  production: 'https://admin.interflux.com'
};

// Where the CDN is located
const cdnHosts = {
  development: 'http://localhost:9000',
  production: 'https://cdn.interflux.com'
};

// The mobile browser's theme colour
// https://developers.google.com/web/fundamentals/design-and-ux/browser-customization/
const themeColour = '#23578c';

module.exports = function(env) {
  // Environment flags
  const isDevelopment = env === 'development';
  const isProduction = env === 'production';
  const isTest = env === 'test';

  // Hosts
  const apiHost = apiHosts[env];
  const appHost = appHosts[env];
  const cdnHost = cdnHosts[env];

  const ENV = {
    appName: PKG.name,
    modulePrefix: PKG.name,
    podModulePrefix: `${PKG.name}/routables`,
    environment: env,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      FEATURES: {},
      EXTEND_PROTOTYPES: {
        Date: false
      }
    },
    APP: {},

    isDevelopment,
    isTest,
    isProduction,
    apiHost,
    appHost,
    cdnHost,
    apiNamespace,
    gitBranch,
    gitRevision,
    themeColour
  };

  if (isTest) {
    ENV.locationType = 'none';
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  return ENV;
};
