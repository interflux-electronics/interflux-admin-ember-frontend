import Model, { attr, hasMany } from '@ember-data/model';

export default class TranslationModel extends Model {
  @attr('string') location;
  @attr('string') language;
  @attr('string') native;
  @attr('string') english;
  @attr('boolean') needsReview;
  @attr('string') reviewCode;
  @attr('string') customReviewMessage;

  @hasMany('translation-event') translationEvents;

  get events() {
    return this.translationEvents;
  }
}
