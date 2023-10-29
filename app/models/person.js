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
  @hasMany('image', { inverse: 'people' }) images;

  @hasMany('company-member') companyMembers;
  @hasMany('person-image') personImages;

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

  get companyMembersSortedByCompany() {
    return this.companyMembers.sortBy('rankAmongCompanies');
  }

  // For storing person images we need a reliable way to kebabcase names.
  // This includes removing special accents, chinese characters and anything not alphanumeric.
  // See model tests.
  //
  // Accent replace inspired from:
  // https://www.30secondsofcode.org/js/s/remove-accents/
  //
  get slug() {
    return this.fullName
      .toLowerCase()
      .replace(/æ/g, 'ae')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s/g, '_')
      .replace(/[\W_]+/g, ' ')
      .trim()
      .replace(/\s/g, '-');
  }
}
