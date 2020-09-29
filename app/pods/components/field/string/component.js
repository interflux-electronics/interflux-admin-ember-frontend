import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

// Usage:
// <Field::String
//   @label="Business name"
//   @record={{company}}
//   @attribute='businessName'
//
//   @type="email"
//   @autofocus="true"
//   @onBlur={{this.onBlur}}
//   @onFocus={{this.onFocus}}
// />

export default class StringFieldComponent extends Component {
  @service form;

  id; // Unique across the app

  constructor() {
    super(...arguments);
    const id = this.form.getUniqueId();
    this.id = `field-${id}`;
  }

  // The <input> type attribute (text, email, password, ...)
  get type() {
    return this.args.type || 'text';
  }

  // Style: primary, secondary, tertiary
  get theme() {
    return this.args.theme || 'primary';
  }

  // VALUE

  get value() {
    return this.args.record.get(this.args.attribute);
  }

  set value(value) {
    this.args.record.set(this.args.attribute, value);
  }

  @action
  onKeyUp(event) {
    const input = event.target;
    const value = input.value;

    // Set the new value on the record
    this.value = value;

    // Fire @onEnter if enter was pressed
    if (event.key === 'Enter') {
      if (this.isDirty) {
        this.args.record.save().then();
      }
    }
  }

  // SAVING

  @tracked changes;

  // Is true when this attribute has unsaved changes (aka dirty)
  get isDirty() {
    // It's important to create const out of these values so they trigger the recomputations
    const { value } = this;
    const { record, attribute } = this.args;
    const change = record.changedAttributes()[attribute];
    if (!change || !record.hasDirtyAttributes) {
      return false;
    }
    const lastSavedValue = change[0];
    return value !== lastSavedValue;
  }

  get isValid() {
    return true;
  }

  get showDropdown() {
    return this.showSave;
  }

  get showSave() {
    return this.isValid && this.isDirty;
  }

  get isSaving() {
    return this.args.record.isSaving;
  }

  // FOCUS

  @tracked hasFocus = false;

  @action
  onFocus() {
    this.hasFocus = true;
  }

  @action
  onBlur() {
    this.hasFocus = false;
  }

  // HOVER

  @tracked hasHover = false;

  @action
  onMouseOver() {
    this.hasHover = true;
  }

  @action
  onMouseOut() {
    this.hasHover = false;
  }
}
