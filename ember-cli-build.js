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

    // Because the 2 JS and 2 CSS bundles are being HTTP2 pushed alongside the
    // index.html by Nginx, we need the name to be predictable and thus have
    // no fingerprints. Cache busting is not needed because the JS and CSS
    // bundles we'll never cache (they update too often). Images, videos and
    // fonts we'll highly cache though.
    fingerprint: {
      enabled: false
    }
  });

  return app.toTree();
};
