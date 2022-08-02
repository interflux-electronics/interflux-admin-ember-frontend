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
  @attr('string') description;
  @attr('string') notes;
  @attr('number') order;
  @attr('boolean') public;
  @attr('boolean') isHeadquarter;
  @attr('boolean') shownOnGroupWebsite;
  @attr('string') coreActivity;
  @attr('string') history;
  @attr('number') rankOnGroupWebsite;
  @attr('boolean') showMarkets;

  @belongsTo('country') country;

  @hasMany('company-member') companyMembers;
  @hasMany('company-market') companyMarkets;

  get people() {
    return this.companyMembers.mapBy('person');
  }

  get markets() {
    return this.companyMarkets.mapBy('country');
  }

  get canBeDeleted() {
    return this.peopleCount === 0;
  }

  get peopleCount() {
    return this.people.length;
  }

  get isInterfluxGroupMember() {
    return this.businessName.startsWith('Interflux');
  }
}
