import Model, { belongsTo } from '@ember-data/model';

export default class CompanyMarketModel extends Model {
  @belongsTo('country') country;
  @belongsTo('language') language;
}
