import Model, { attr } from '@ember-data/model';

export default class TranslationModel extends Model {
  @attr('string') location;
  @attr('string') language;
  @attr('string') native;
  @attr('string') english;
  @attr('string') englishBefore;
  @attr('string') status;

  get rank() {
    return {
      'to-translate': 1,
      'to-update': 2,
      'to-review': 3,
      done: 4
    }[this.status];
  }
}
