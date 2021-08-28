'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const ENV = require('./config/environment')(EmberApp.env());

// To make CSS environment aware we assign a new src to output map.
// The src changes with the environment.
const cssMap = {};
cssMap[ENV.environment] = '/assets/app.css';

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    outputPaths: {
      app: {
        js: '/assets/app.js',
        css: cssMap
      }
    },

    // Makes SASS listen to file changes in the component folders
    sassOptions: {
      includePaths: ['app/pods'],
      overwrite: true,
      sourceMap: false
    },

    // Adds CSS browser prefixes
    autoprefixer: {
      cascade: false,
      remove: false
    },

    // Fingerprint files with the git revision rather than the MD5 to deduct from which deploy.
    fingerprint: {
      customHash: ENV.gitRevision
    }
  });

  return app.toTree();
};
