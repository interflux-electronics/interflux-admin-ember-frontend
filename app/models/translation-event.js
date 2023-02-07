import Model, { attr, belongsTo } from '@ember-data/model';

export default class TranslationEventModel extends Model {
  @attr('string') code;
  @attr('string') updatedBy;
  @attr('date') createdAt;

  @belongsTo('translation') translation;

  get label() {
    const date = this.createdAt.toISOString().split('T')[0];

    if (this.code === 'created') {
      return `${date} | created by ${this.updatedBy}`;
    }

    if (this.code === 'source-update') {
      return `${date} | English source updated by ${this.updatedBy}`;
    }

    return this.code;
  }
}
