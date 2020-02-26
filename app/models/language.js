import Model, { attr } from '@ember-data/model';

export default class LanguageModel extends Model {
  @attr('string') nameEnglish;
  @attr('string') nameNative;
  @attr('string') iso6391code;
  @attr('string') iso6392code;
  @attr('boolean') public;
}
