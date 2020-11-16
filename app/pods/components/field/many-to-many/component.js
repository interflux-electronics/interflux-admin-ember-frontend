import FieldComponent from '../component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

// <Field::ManyToMany
//   @label="Products"
//   @baseRecord={{quality}}
//   @baseModel="quality"
//   @baseLabel="productQualities"
//   @joinModel="product-quality"
//   @targetModel="product"
//   @targetLabel="name"
//   @targetRoute='secure.products.product'
// />

export default class ManyToManyFieldComponent extends FieldComponent {
  @service api;
  @service store;

  get rows() {
    const { baseRecord, baseLabel, targetLabel, targetModel } = this.args;
    const joinRecords = baseRecord.get(baseLabel).rejectBy('isNew', true);
    const arr = [];

    joinRecords.forEach((joinRecord) => {
      const targetRecord = joinRecord.get(targetModel);
      arr.push({
        joinRecord,
        targetRecord,
        text: targetRecord.get(targetLabel)
      });
    });

    return arr;
  }

  @tracked showSearch = false;

  @action
  onClickAddButton() {
    this.showSearch = true;
  }

  @action
  onSearchBlur() {
    this.showSearch = false;
  }

  get isDirty() {
    return false;
  }

  // The <Search> component will never have to show the selected value
  get value() {
    return null;
  }

  set value(value) {
    // this.args.record.set(this.args.relation, value);
  }

  @action
  onSelect(targetRecord) {
    const {
      baseRecord,
      baseModel,
      joinModel,
      targetModel,
      targetLabel
    } = this.args;

    console.debug('selected', targetRecord[targetLabel]);

    const props = {};
    props[baseModel] = baseRecord;
    props[targetModel] = targetRecord;

    console.debug('creating', props);

    const newRecord = this.store.createRecord(joinModel, props);

    newRecord
      .save()
      .then(() => {
        console.debug('success');
      })
      .catch((response) => {
        this.api.logError(response);
      });
  }

  @action
  onDestroy(joinRecord) {
    joinRecord.destroyRecord();
  }

  @action
  onKeyUp() {
    this.error = null;
  }

  get searchFilter() {
    return this.args.targetFilter || this.args.targetLabel;
  }
}
