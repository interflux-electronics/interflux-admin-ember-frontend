import FieldComponent from '../component';

export default class ManyToOneFieldComponent extends FieldComponent {
  get relations() {
    const { record, relation, relationLabel } = this.args;
    const arr = [];
    const records = record.get(relation).sortBy(relationLabel);

    records.forEach((record) => {
      arr.push({
        label: record.get(relationLabel),
        record
      });
    });

    return arr;
  }
}
