import FieldComponent from '../component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

// TODO: clear rank when added
// TODO: sort by name button
// TODO: sort by status button
// TODO: add extra filters to the query
// TODO: do not show already selected records
// TODO: do not add already selected records a second time

export default class OneToManyFieldComponent extends FieldComponent {
  // @arg label;
  // @arg legend;
  // @arg baseRecord;
  // @arg baseLabel;
  // @arg targetModel;
  // @arg targetLabel;
  // @arg targetFilter;
  // @arg targetLabel;
  // @arg targetRoute;
  // @arg autoSave;

  fieldset;

  @action
  onInsert(fieldset) {
    this.fieldset = fieldset;
  }

  get chosenRecord() {
    const { baseRecord, baseLabel } = this.args;

    return baseRecord.get(baseLabel);
  }

  get chosenLabel() {
    const { chosenRecord } = this;
    const { targetLabel, targetFilter } = this.args;

    return targetLabel
      ? chosenRecord.get(targetLabel)
      : chosenRecord.get(targetFilter);
  }

  @tracked showSearch = false;

  delay(ms) {
    return new Promise((approve) => {
      window.setTimeout(approve, ms);
    });
  }

  @action
  async onEdit() {
    this.showSearch = true;
    await this.delay(1);
    this.fieldset.querySelector('.search input').focus();
  }

  @action
  onFocus() {
    this.hasFocus = true;
  }

  @action
  onBlur() {
    this.hasFocus = false;
    this.showSearch = false;
  }

  @action
  onSelect(chosenRecord) {
    const { baseRecord, baseLabel } = this.args;
    this.showSearch = false;
    baseRecord[baseLabel] = chosenRecord;
    if (this.args.localSave) {
      return;
    }
    console.debug('saving');
    baseRecord
      .save({
        adapterOptions: {
          whitelist: this.args.baseLabel
        }
      })
      .then(() => {
        console.debug('success');
      })
      .catch((response) => {
        // Log error in console
        this.api.logError(response);

        // Show error to user
        try {
          this.error = response.errors[0].code || 'unknown';
        } catch (e) {
          this.error = 'unknown';
        }
      });
  }

  @action
  onKeyUp() {
    this.error = null;
  }

  // override
  get isDirty() {
    return false;
  }
}
