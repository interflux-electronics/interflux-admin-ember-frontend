import Component from '@glimmer/component';

export default class HasManyRelationsComponent extends Component {
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
