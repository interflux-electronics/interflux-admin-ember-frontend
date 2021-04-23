import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import ENV from 'interflux/config/environment';

export default class QualityModel extends Model {
  @attr('string') slug;
  @attr('string') icon;
  @attr('string') text;
  @attr('string') gist;

  @belongsTo('image') image;

  @hasMany('product-quality') productQualities;

  get products() {
    const rank = 'rankAmongProducts';
    const records = this.productQualities;
    const ranked = records.filterBy(rank).sortBy(rank);
    const rankless = records.rejectBy(rank);
    const sorted = [...ranked, ...rankless];

    return sorted.map((record) => record.product);
  }

  get productCount() {
    return this.products.length;
  }

  get families() {
    return this.products.mapBy('family').uniqBy('id');
  }

  get label() {
    const str = this.text || '';
    return str[0].toUpperCase() + str.slice(1);
  }

  get iconURL() {
    return this.icon
      ? `${ENV.cdnHost}/${this.icon}`
      : `${ENV.cdnHost}/images/icons/check.svg`;
  }
}
