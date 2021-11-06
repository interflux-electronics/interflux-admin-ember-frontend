import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class VideoModel extends Model {
  @attr('string') path;
  @attr('string') variations;
  @attr('string') titleAdmin;
  @attr('string') titlePublic;
  @attr('string') posterUrl;

  @hasMany('cdn-files') files;

  @belongsTo('webinar') webinar;

  get category() {
    return this.path.split('/')[1];
  }

  get isWebinar() {
    return this.category === 'webinars';
  }

  get MP4s() {
    return this.files.filterBy('isMP4').sortBy('width');
  }

  get WEBMs() {
    return this.files.filterBy('isWEBM').sortBy('width');
  }

  get hasMP4() {
    return this.MP4s.length > 0;
  }

  get hasWEBM() {
    return this.WEBMs.length > 0;
  }
}
