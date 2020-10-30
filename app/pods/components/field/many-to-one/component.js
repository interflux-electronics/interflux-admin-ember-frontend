import FieldComponent from '../component';
import { action } from '@ember/object';

export default class ManyToOneFieldComponent extends FieldComponent {
  get relations() {
    const arr = [];
    const records = this.args.record.get(this.args.relation);

    records.forEach((record) => {
      arr.push({
        label: record.get(this.args.relationLabel),
        record
      });
    });

    return arr;
  }
}
