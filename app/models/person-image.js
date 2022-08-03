import Model, { belongsTo } from '@ember-data/model';

export default class ImageModel extends Model {
  @belongsTo('person') person;
  @belongsTo('image') image;
}
