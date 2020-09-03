'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const ENV = require('./config/environment')(EmberApp.env());

// To make CSS environment aware we assign a new src to output map.
// The src changes with the environment.
const cssMap = {};

cssMap[ENV.environment] = `/assets/app.css`;

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    outputPaths: {
      app: {
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

    // Prevent CSS minification in development and tests
    minifyCSS: {
      enabled: ENV.isProduction
    },

    // Prevent JS minification in development and tests
    minifyJS: {
      enabled: ENV.isProduction
    },

    // Enable source maps in all environments because it helps debugging.
    sourcemaps: {
      enabled: true,
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
