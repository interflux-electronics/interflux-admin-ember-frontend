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
//   @joinSortKey="rankAmongQualities"
//   @targetModel="product"
//   @targetLabel="fullName"
//   @targetFilter="firstName"
//   @targetRoute='secure.products.product'
// />

export default class ManyToManyFieldComponent extends FieldComponent {
  // @arg label;
  // @arg legend;
  // @arg baseRecord;
  // @arg baseModel;
  // @arg baseLabel;
  // @arg joinModel;
  // @arg joinSortKey;
  // @arg targetModel;
  // @arg targetLabel;
  // @arg targetFilter;
  // @arg targetLabel;
  // @arg targetRoute;

  @service api;
  @service store;

  get joinRecords() {
    const {
      baseRecord,
      baseLabel,
      joinSortKey,
      targetModel,
      targetLabel
    } = this.args;
    const joinRecords = baseRecord.get(baseLabel);

    // The join model does NOT have a rank property to sort by.
    // Return all join records sorted alphabetically by the target label.
    if (!joinSortKey) {
      return joinRecords.sortBy(targetModel + '.' + targetLabel);
    }

    // Sort by join record rank. Move all those with undefined rank to the very bottom.
    const ranked = joinRecords.filterBy(joinSortKey).sortBy(joinSortKey);
    const rankless = joinRecords.rejectBy(joinSortKey);
    return [...ranked, ...rankless];
  }

  get rows() {
    const { targetLabel, targetModel, joinSortKey } = this.args;
    return this.joinRecords.map((joinRecord, i, arr) => {
      const targetRecord = joinRecord.get(targetModel);
      return {
        joinRecord,
        targetRecord,
        text: targetRecord.get(targetLabel),
        rank: joinRecord[joinSortKey] || i + 1,
        hasRankOnRecord: joinRecord[joinSortKey] ? true : false,
        isLast: i === arr.length - 1
      };
    });
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
  onKeyUp() {
    this.error = null;
  }

  get searchFilter() {
    return this.args.targetFilter || this.args.targetLabel;
  }

  // DRAG & REORDER LOGIC

  @tracked dragee = null;

  get isDragging() {
    return this.dragee !== null;
  }

  get canSortList() {
    return this.args.joinSortKey && this.rows.length > 1;
  }

  @action
  async handleDragStart(row, event) {
    console.debug(`started dragging row ${row.rank}`);
    const li = event.currentTarget;

    // To prevent the blue lines from being rendered in the transparent screenshot being dragged.
    // It also solves an odd bug wich triggers drag end.
    await new Promise((resolve) => setTimeout(resolve, 1));

    this.dragee = row;
    li.classList.add('dragee');
  }

  @action
  handleDragEnd(row, event) {
    console.debug('stopped');
    this.dragee = null;
    event.currentTarget.classList.remove('dragee');
  }

  @action
  handleDragEnter(row, event) {
    event.preventDefault();
    event.currentTarget.classList.add('active');
  }

  @action
  handleDragLeave(row, event) {
    event.preventDefault();
    event.currentTarget.classList.remove('active');
  }

  // Without this, ondrop would not trigger
  @action
  handleDragOver(row, event) {
    event.preventDefault();
  }

  @action
  handleDrop(row, event) {
    console.debug(`dropped row ${this.dragee.rank} on row ${row.rank}`);

    const isBottomMost = event.currentTarget.classList.contains('bottom');
    const from = this.dragee.rank;
    const to = isBottomMost ? row.rank + 1 : row.rank;

    this.moveRow(from, to);

    // Reset drag state.
    this.dragee = null;
    event.currentTarget.classList.remove('active');
  }

  async moveRow(from, to) {
    console.debug('move row', { from, to });

    // Move one row from origin to destination by creating a new array.
    const { dragee } = this;
    const nonDragees = this.rows.filter((row) => row.rank !== from);
    const rowsBefore = nonDragees.filter((row) => row.rank < to);
    const rowsAfter = nonDragees.filter((row) => row.rank >= to);
    const newRows = [...rowsBefore, dragee, ...rowsAfter];

    const { joinSortKey } = this.args;

    // Iterate over the new array and use its positional index to update all ranks.
    newRows.forEach((row, i) => {
      const newRank = i + 1;

      console.debug(`moving ${row.rank} to ${newRank}`);

      row.joinRecord[joinSortKey] = newRank;

      if (row.joinRecord.hasDirtyAttributes) {
        row.joinRecord.save();
      }
    });
  }

  // DESTROY

  @action
  onDestroy(joinRecord) {
    console.debug('destroy join record', { joinRecord });
    joinRecord.destroyRecord();
  }
}
