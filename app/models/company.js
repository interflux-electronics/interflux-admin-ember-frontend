import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class CompanyModel extends Model {
  @attr('string') businessName;
  @attr('string') legalName;
  @attr('string') address;
  @attr('string') phone;
  @attr('string') fax;
  @attr('string') emailGeneral;
  @attr('string') emailSupport;
  @attr('string') emailOrders;
  @attr('string') emailAccounting;
  @attr('string') website;
  @attr('string') latitude;
  @attr('string') longitude;

  @attr('number') order;
  @attr('boolean') public;

  @belongsTo('country') country;

  @hasMany('person') people;
  @hasMany('country') markets;

  @hasMany('company-member') companyMembers;
  @hasMany('company-market') companyMarkets;
}
