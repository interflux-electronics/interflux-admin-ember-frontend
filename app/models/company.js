import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class CompanyModel extends Model {
  @attr('string') businessName;
  @attr('string') legalName;
  @attr('string') address;
  @attr('string') phone;
  @attr('string') fax;
  @attr('array') emails;
  @attr('string') website;
  @attr('string') latitude;
  @attr('string') longitude;

  @belongsTo('country') country;

  // @hasMany('member') member;
  // @hasMany('market') country;
}
