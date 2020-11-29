import FieldComponent from '../component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

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

  @action
  onClickEditButton() {
    this.showSearch = true;
  }

  @action
  onSelect(chosenRecord) {
    const { baseRecord, baseLabel } = this.args;
    this.showSearch = false;
    baseRecord[baseLabel] = chosenRecord;
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
}
