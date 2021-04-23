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
//   @joinRankKey="rankAmongQualities"
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
  // @arg joinRankKey;
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
      joinRankKey,
      targetModel,
      targetLabel
    } = this.args;

    const joinRecords = baseRecord.get(baseLabel);

    // The join model does NOT have a rank property to sort by.
    // Return all join records sorted alphabetically by the target label.
    if (!joinRankKey) {
      return joinRecords.sortBy(targetModel + '.' + targetLabel);
    }

    // Sort by join record rank. Move all those with undefined rank to the very bottom.
    const ranked = joinRecords.filterBy(joinRankKey).sortBy(joinRankKey);
    const rankless = joinRecords.rejectBy(joinRankKey);
    return [...ranked, ...rankless];
  }

  get rows() {
    const { targetLabel, targetModel, joinRankKey } = this.args;

    return this.joinRecords.map((joinRecord, i, arr) => {
      const targetRecord = joinRecord.get(targetModel);
      return {
        joinRecord,
        targetRecord,
        label: targetRecord.get(targetLabel) || 'N/A',
        rank: joinRecord[joinRankKey] || i + 1,
        isRanked: joinRecord[joinRankKey] ? true : false,
        isLast: i === arr.length - 1
      };
    });
  }

  get listClasses() {
    return [
      this.canSortList ? 'can-sort-list' : 'no-sort',
      this.isDragging ? 'is-dragging' : 'no-drag'
    ].join(' ');
  }

  // SEARCH & ADD LOGIC

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

    newRecord.save().catch((response) => {
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
    return this.args.joinRankKey;
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

    const { joinRankKey } = this.args;

    // Iterate over the new array and use its positional index to update all ranks.
    newRows.forEach((row, i) => {
      const newRank = i + 1;

      console.debug(`moving ${row.rank} to ${newRank}`);

      row.joinRecord[joinRankKey] = newRank;

      if (row.joinRecord.hasDirtyAttributes) {
        row.joinRecord.save().catch((response) => {
          this.api.logError(response);
        });
      }
    });
  }

  // DESTROY

  @action
  onDestroy(joinRecord) {
    console.debug('destroy join record', { joinRecord });
    joinRecord.destroyRecord();
  }

  // FOCUS

  @action
  onSearchFocus() {
    // Do nothing to prevent background from going blue.
  }

  // DOT DOT DOT MENU FLAGS

  @action
  async toggleFlag(joinRecord, key) {
    const bool = joinRecord.get(key);
    joinRecord.set(key, !bool);
    await joinRecord.save();
  }
}
