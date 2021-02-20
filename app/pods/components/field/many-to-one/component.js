import FieldComponent from '../component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ManyToOneFieldComponent extends FieldComponent {
  get targetRecords() {
    const { baseRecord, targetRank, baseLabel, targetLabel } = this.args;
    const targetRecords = baseRecord.get(baseLabel);

    // The target model does not have a rank key, then sort alphabetically by label.
    if (!targetRank) {
      return targetRecords.sortBy(targetLabel);
    }

    // Sort by join record rank. Move all those with undefined rank to the very bottom.
    const ranked = targetRecords.filterBy(targetRank).sortBy(targetRank);
    const rankless = targetRecords.rejectBy(targetRank);
    return [...ranked, ...rankless];
  }

  get rows() {
    const { targetLabel, targetRank } = this.args;

    return this.targetRecords.map((targetRecord, i, arr) => {
      return {
        targetRecord,
        label: targetRecord.get(targetLabel),
        rank: targetRecord[targetRank] || i + 1,
        isRanked: targetRecord[targetRank] ? true : false,
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

  // DRAG & REORDER LOGIC

  @tracked dragee = null;

  get isDragging() {
    return this.dragee !== null;
  }

  get canSortList() {
    return this.args.targetRank;
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

    const { targetRank } = this.args;

    // Iterate over the new array and use its positional index to update all ranks.
    newRows.forEach((row, i) => {
      const newRank = i + 1;

      console.debug(`moving ${row.rank} to ${newRank}`);

      row.targetRecord[targetRank] = newRank;

      if (row.targetRecord.hasDirtyAttributes) {
        console.debug('saving...', i);
        row.targetRecord.save().catch((response) => {
          this.api.logError(response);
        });
      }
    });
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
    const { baseRecord, targetLabel, targetForeignId } = this.args;

    targetRecord[targetForeignId] = baseRecord;

    console.debug(`updating ${targetRecord[targetLabel]} to ${baseRecord.id}`);

    targetRecord
      .save({
        adapterOptions: {
          whitelist: [targetForeignId]
        }
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

  // REMOVE

  @action
  remove(row) {
    const { targetRecord } = row;
    const { targetForeignId } = this.args;

    console.debug('remove', targetRecord.id);

    targetRecord[targetForeignId] = null;
    targetRecord
      .save({
        adapterOptions: {
          whitelist: [targetForeignId]
        }
      })
      .catch((response) => {
        this.api.logError(response);
      });
  }

  // FOCUS

  @action
  onFocus() {
    // Do nothing to prevent background from going blue.
  }
}
