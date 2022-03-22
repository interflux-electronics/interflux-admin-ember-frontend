import Model, { attr, hasMany } from '@ember-data/model';
import ENV from 'interflux/config/environment';

export default class CountryModel extends Model {
  @attr('string') nameEnglish;
  @attr('string') nameNative;
  @attr('string') twoLetterCode;
  @attr('string') threeLetterCode;
  @attr('string') numericCode;
  @attr('string') region;
  @attr('string') subregion;
  @attr('number') latitude;
  @attr('number') longitude;
  @attr('number') area;
  @attr('number') population;
  @attr('string') flagUrl;
  @attr('array') timezones;
  @attr('array') topLevelDomains;
  @attr('array') callingCodes;

  @hasMany('company-market') companyMarkets;

  get companyNames() {
    return this.companyMarkets
      .sortBy('rankAmongCompanies')
      .mapBy('company.businessName')
      .join(', ');
  }

  @hasMany('country-language') countryLanguages;

  get languages() {
    return this.countryLanguages.mapBy('language');
  }

  get flag() {
    return `${ENV.cdnHost}/images/flags/${this.id}.svg`;
  }
}
