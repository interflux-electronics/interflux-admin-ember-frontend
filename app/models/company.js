import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class CompanyModel extends Model {
  @attr('string') businessName;
  @attr('string') legalName;
  @attr('string') address;
  @attr('string') phone;
  @attr('string') fax;
  // @attr('array') emails;
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

  @hasMany('person') members;
  @hasMany('country') markets;

  // validations = {
  //   businessName: ['not-blank', 'only-letters'],
  //   website: ['is-url-or-blank']
  // };
}
