import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import ENV from 'interflux/config/environment';

export default class VideoModel extends Model {
  @attr('string') path;
  @attr('string') variations;
  @attr('string') title;
  @attr('string') notes;

  @belongsTo('webinar') webinar;

  @hasMany('product-video') productVideos;
  @hasMany('product', { inverse: 'videos' }) products;

  get isWebinar() {
    return this.path.split('/')[1] === 'webinars';
  }

  // VIDEOS

  get MP4s() {
    return this.variations?.split(',').filter((x) => x.endsWith('.mp4'));
  }

  get WEBMs() {
    return this.variations?.split(',').filter((x) => x.endsWith('.webm'));
  }

  get OGGs() {
    return this.variations?.split(',').filter((x) => x.endsWith('.ogg'));
  }

  // POSTERS

  get JPGs() {
    return this.variations
      ? this.variations.split(',').filter((x) => x.endsWith('.jpg'))
      : [];
  }

  get WEBPs() {
    return this.variations
      ? this.variations.split(',').filter((x) => x.endsWith('.webp'))
      : [];
  }

  get PNGs() {
    return this.variations
      ? this.variations.split(',').filter((x) => x.endsWith('.png'))
      : [];
  }

  get posters() {
    return [...this.WEBPs, ...this.JPGs, ...this.PNGs];
  }

  get hasPoster() {
    return this.posters.length > 0;
  }

  get thumbURL() {
    if (!this.hasPoster) {
      return null;
    }

    return `${ENV.cdnHost}/${this.path}${this.posters[0]}`;
  }
}
