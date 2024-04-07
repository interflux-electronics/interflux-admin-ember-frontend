import Model, { attr, belongsTo } from '@ember-data/model';
import ENV from 'interflux/config/environment';

export default class PermalinkModel extends Model {
  @attr('string') slug;
  @attr('string') redirectTo;
  @attr('string') notes;

  @belongsTo('event') event;

  get redirectFrom() {
    return `${ENV.publicHost}/QR/${this.slug}`;
  }

  get host() {
    return this.redirectTo.replace('https://', '').split('/')[0];
  }

  get path() {
    return this.redirectTo.replace('https://', '').replace(this.host, '');
  }
}
