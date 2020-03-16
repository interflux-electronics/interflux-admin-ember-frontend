import Model, { attr, belongsTo } from '@ember-data/model';

export default class LanguageModel extends Model {
  @attr('string') name;
  @attr('string') company;
  @attr('string') email;
  @attr('string') mobile;
  @attr('string') message;
  @attr('string') purpose;
  @attr('string') source;
  @attr('string') ipRegion;
  @attr('string') ipCity;
  @attr('string') ip;

  @belongsTo('country') country;
  @belongsTo('country') ipCountry;

  get label() {
    return [this.purpose, this.company].join(' - ');
  }
}
