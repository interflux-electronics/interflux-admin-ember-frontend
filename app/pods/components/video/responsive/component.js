import Component from '@glimmer/component';

export default class VideoResponsiveComponent extends Component {}

// import Component from '@ember/component';
// import config from 'ember-get-config';
// import { computed } from '@ember/object';
//
// const { cdnHost } = config.buildConfig;
//
// const videoFormats = [
//   {
//     ext: '.webm',
//     mime: 'video/webm'
//   },
//   {
//     ext: '.ogv',
//     mime: 'video/ogg'
//   },
//   {
//     ext: '.mp4',
//     mime: 'video/mp4'
//   }
// ];
//
// const imageFormats = [
//   {
//     ext: '.webp',
//     mime: 'image/webp'
//   },
//   {
//     ext: '.jpg',
//     mime: 'image/jpeg'
//   },
//   {
//     ext: '.png',
//     mime: 'image/png'
//   },
//   {
//     ext: '.svg',
//     mime: 'image/svg+xml'
//   }
// ];
//
// export default Component.extend({
//   tagName: 'figure',
//   classNames: ['responsive-image'],
//   // attributeBindings: ['src', 'width', 'height', 'alt'],
//
//   // Passed in
//   cdnPath: undefined,
//   sizes: undefined,
//   formats: undefined,
//   alt: undefined,
//   caption: undefined,
//
//   // Computed and set later
//   src: undefined,
//   width: undefined,
//   height: undefined,
//   loading: true,
//   loadFailed: undefined,
//
//   // Is video if all formats are known video formats
//   isVideo: computed(function() {
//     return false;
//     // return this.formats.split(',').all(format => {
//     //   return videoFormats.some(f => {
//     //     return format === f.ext;
//     //   });
//     // });
//   }),
//
//   // Is image if all formats are known image formats
//   isImage: computed(function() {
//     return true;
//     // return this.formats.split(',').all(format => {
//     //   return imageFormats.some(f => {
//     //     return format === f.ext;
//     //   });
//     // });
//   }),
//
//   init() {
//     this._super(...arguments);
//
//     this.needs('cdnPath');
//     this.needs('alt');
//     this.needs('sizes');
//
//     this.setOptimalSize();
//   },
//
//   setOptimalSize() {
//     // Exit early if params are missing
//     if (!this.cdnPath || !this.sizes) {
//       this.set('loading', false);
//       this.set('loadFailed', true);
//       // TODO: Warn
//       // TODO: Log report
//       return;
//     }
//
//     if (!this.cdnPath.startsWith('/')) {
//       console.warn('Please start all cdnPaths with /');
//       // TODO: Log report
//     }
//
//     let src = cdnHost + this.cdnPath;
//
//     // SVG don't need to be made responsive.
//     // They only need the CDN to be prepended.
//     if (src.endsWith('.svg')) {
//       return this.set('src', src);
//     }
//
//     const sizes = this.sizes.split(',');
//
//     // TODO: improve
//     const optimum = sizes[0];
//
//     const width = optimum.split('x')[0];
//     const height = optimum.split('x')[1];
//
//     src = src.replace(/.jpg$/, `@${optimum}.jpg`);
//
//     this.setProperties({
//       src,
//       width,
//       height
//     });
//
//     if (sizes.length > 1) {
//       // this.watchScreenSize.perform();
//     }
//   },
//
//   needs(property) {
//     if (!this.get(property)) {
//       console.warn(`responsive-image is missing ${property}`);
//     }
//   },
//
//   actions: {
//     onLoad() {
//       this.set('loading', false);
//     },
//     onError() {
//       console.warn('image fetch fail');
//       this.set('loading', false);
//       this.set('loadFailed', true);
//       // this.watchScreenSize.perform();
//       // TODO: log report!
//     }
//   }
// });
