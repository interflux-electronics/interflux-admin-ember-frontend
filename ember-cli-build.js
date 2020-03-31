'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const ENV = require('./config/environment')(EmberApp.env());

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    // Makes SASS listen to file changes in the component folders
    sassOptions: {
      includePaths: ['app/routables'],
      overwrite: true
    },

    // Adds CSS browser prefixes
    autoprefixer: {
      cascade: false,
      remove: false
    },

    // Prevent CSS minification in development and tests
    minifyCSS: {
      enabled: ENV.isProduction
    },

    // Prevent JS minification in development and tests
    minifyJS: {
      enabled: ENV.isProduction
    },

    // Enable source maps for debugging and Sentry
    sourcemaps: {
      enabled: ENV.isProduction,
      extensions: ['js']
    },

    fingerprint: {
      enabled: ENV.isProduction,
      extensions: [
        'js',
        'css',
        'png',
        'jpg',
        'svg',
        'map',
        'mp4',
        'ogg',
        'webp',
        'webm',
        'woff',
        'woff2'
      ],
      replaceExtensions: ['html', 'css', 'scss', 'js'],
      customHash: ENV.gitRevision
    },

    'ember-fetch': {
      preferNative: true
    }
  });

  return app.toTree();
};
