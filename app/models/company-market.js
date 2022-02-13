import Model, { belongsTo, attr } from '@ember-data/model';

export default class CompanyMarketModel extends Model {
  @belongsTo('company') company;
  @belongsTo('country') country;

  @attr('number') rankAmongCompanies;
  @attr('number') rankAmongCountries;
  @attr('boolean') companyIsRecommended;
}
