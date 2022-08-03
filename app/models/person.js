import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PersonModel extends Model {
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') chineseName;
  @attr('string') fullName;
  @attr('string') phone;
  @attr('string') email;
  @attr('boolean') public;
  @attr('boolean') hasUser;
  @attr('string') avatarPath;
  @attr('string') avatarAlt;
  @attr('string') avatarCaption;
  @attr('string') avatarVariations;

  @belongsTo('image', { inverse: 'person' }) image;

  @hasMany('company-member') companyMembers;
  @hasMany('person-image') personImages;
  @hasMany('image', { inverse: 'products' }) images;

  get companies() {
    return this.companyMembers.mapBy('company');
  }

  get memberOf() {
    return this.companies.mapBy('businessName').join(', ');
  }

  get companyCount() {
    return this.companies.length;
  }

  get canBeDeleted() {
    return this.companyCount === 0 && !this.hasUser;
  }
}
