import Model, { attr } from '@ember-data/model';

export default class LanguageModel extends Model {
  @attr('string') nameEnglish;
  @attr('string') nameNative;
  @attr('string') twoLetterCode;
  @attr('string') threeLetterCode;
  @attr('boolean') public;
}
