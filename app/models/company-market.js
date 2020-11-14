import Model, { belongsTo } from '@ember-data/model';

export default class CompanyPersonModel extends Model {
  @belongsTo('company') company;
  @belongsTo('country') country;
}
