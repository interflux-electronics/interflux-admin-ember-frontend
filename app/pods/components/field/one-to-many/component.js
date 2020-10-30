import FieldComponent from '../component';
import { action } from '@ember/object';

export default class OneToManyFieldComponent extends FieldComponent {
  constructor() {
    super(...arguments);

    const { record, relation } = this.args;
    const value = record.get(relation);

    this.lastSavedValue = value;

    if (value === undefined) {
      console.warn(`${relation} is not an attribute on the model`);
    }
  }

  get value() {
    return this.args.record.get(this.args.relation);
  }

  set value(value) {
    this.args.record.set(this.args.relation, value);
  }

  @action
  onSelect(record) {
    console.debug('selected', record[this.args.filterOn]);
    this.value = record;
    console.debug('saving');
    this.save();
  }

  @action
  onKeyUp() {
    this.error = null;
  }
}
