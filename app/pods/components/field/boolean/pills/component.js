import FieldComponent from '../component';
import { action } from '@ember/object';

export default class FieldFileComponent extends FieldComponent {
  @action
  onSelect(selectedValue) {
    this.value = selectedValue;
    this.save();
  }
}
