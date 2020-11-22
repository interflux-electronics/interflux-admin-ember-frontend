import Service from '@ember/service';

export default class BrowserService extends Service {
  get supportsWEBP() {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      // was able or not to get WebP representation
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') == 0;
    } else {
      // very old browser like IE 8, canvas not supported
      return false;
    }
  }
}
