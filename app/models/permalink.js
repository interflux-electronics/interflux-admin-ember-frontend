import Model, { attr } from '@ember-data/model';

export default class PermalinkModel extends Model {
  @attr('string') slug;
  @attr('string') redirectTo;
  @attr('string') notes;

  get redirectFrom() {
    return `https://interflux.com/QR/${this.slug}`;
  }
}
