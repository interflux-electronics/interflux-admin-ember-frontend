import FieldComponent from '../component';
import { action } from '@ember/object';

export default class FieldBooleanPillsComponent extends FieldComponent {
  @action
  onSelect(selectedValue) {
    this.value = selectedValue;
    this.save();

    if (this.args.afterSave) {
      this.args.afterSave();
    }
  }
}
