import Model, { attr, belongsTo } from '@ember-data/model';

export default class ProductDocumentModel extends Model {
  @attr('number') rankAmongProducts;
  @attr('number') rankAmongDocuments;

  @belongsTo('product') product;
  @belongsTo('document') document;
}
