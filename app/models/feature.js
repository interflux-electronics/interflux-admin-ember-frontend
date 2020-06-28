import Model, { attr, hasMany } from '@ember-data/model';
import { alias } from '@ember/object/computed';

export default class FeatureModel extends Model {
  @attr('string') slug;
  @attr('string') icon;
  @attr('string') text;
  @alias('text') name;
  @attr('string') gist;
  @attr('string') category;
  @attr('boolean') hasPage;

  @hasMany('product') products;

  get families() {
    return this.products.mapBy('family').uniqBy('id');
  }
}
