import Model, { belongsTo } from '@ember-data/model';

export default class ProductDocumentModel extends Model {
  @belongsTo('product') product;
  @belongsTo('document') document;
}
