import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class FieldStringComponent extends Component {
  @tracked value = '';
  @tracked hasFocus = false;

  get type() {
    return this.args.type || 'text';
  }

  get autofocus() {
    return this.args.autofocus || false;
  }

  @action
  onFocus(event) {
    // Notify the <Field> component that the <input> has focus
    this.hasFocus = true;
    // Fire @onFocus events in parent component
    if (this.args.onFocus) {
      this.args.onFocus(event);
    }
    // Select all text inside the <input> on focus
    event.target.select();
  }

  @action
  onBlur(event) {
    // Notify the <Field> component that the <input> no longer has focus
    this.hasFocus = true;
    // Fire @onBlur events in parent component
    if (this.args.onBlur) {
      this.args.onBlur(event);
    }
  }

  @action
  onKeyUp(event) {
    const value = event.target.value;
    const valueChanged = value !== this.value;

    if (valueChanged) {
      // Remember locally so we can later test if value changed
      this.value = value;

      // Fire @onChange only if the value changed
      if (this.args.onChange) {
        this.args.onChange(value);
      }
    }

    // Fire @onEnter if enter was pressed
    if (event.key === 'Enter') {
      if (this.args.onEnter) {
        this.args.onEnter(event);
      }
    }
  }
}
