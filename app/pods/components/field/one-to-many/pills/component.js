import FieldComponent from '../component';
import { action } from '@ember/object';

export default class OneToManyPillsComponent extends FieldComponent {
  @action
  onSelect(option) {
    const { record, belongsTo, localSave } = this.args;
    record[belongsTo] = option;
    if (localSave) {
      return;
    }
    record.save({
      adapterOptions: {
        whitelist: [belongsTo]
      }
    });
  }
}
