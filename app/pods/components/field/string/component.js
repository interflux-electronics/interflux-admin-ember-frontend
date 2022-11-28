import FieldComponent from '../component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

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

const bulletsTemplate = `

* a
* b
* c
`;

export default class StringFieldComponent extends FieldComponent {
  constructor() {
    super(...arguments);

    const { record, attribute } = this.args;
    const value = record.get(attribute);

    if (value || value === '') {
      this.lastSavedValue = value;
    }

    if (!record.isNew && value === undefined) {
      console.warn(`${attribute} is not an attribute on the model`);
    }
  }

  get value() {
    return this.args.record.get(this.args.attribute);
  }

  set value(value) {
    this.args.record.set(this.args.attribute, value);
  }

  @action
  onKeyUp(event) {
    const { multiline } = this.args;
    const element = event.target;

    // If it's an <input> we grab the value. If it's a contenteditable <p>, we grab its innerText.
    const value = multiline ? element.innerText : element.value;

    // Set the new value on the record
    this.value = value;

    // Reset errors
    this.error = null;

    // On enter, save the attribute, unless it's a <Form::Textarea>
    if (event.key === 'Enter' && !multiline) {
      this.save();
    }

    if (event.key === 'Enter') {
      this.args.onEnter();
    }
  }

  get theme() {
    return this.args.tools ? 'has-tools' : 'no-tools';
  }

  @tracked editing = true;

  get showEditPanel() {
    return this.editing;
  }

  get showPreviewPanel() {
    return !this.editing;
  }

  @action
  onEditTabClick() {
    this.editing = true;
  }

  @action
  onPreviewTabClick() {
    this.editing = false;
  }

  @action
  onToolClick(tool) {
    const textarea = document.getElementById(`textarea-${this.id}`);

    if (!textarea) {
      return;
    }

    const selection = window.getSelection();
    const range = selection.isCollapsed ? null : selection.getRangeAt(0);
    const start = selection.isCollapsed ? null : range.startOffset;
    const end = selection.isCollapsed ? null : range.endOffset;

    let value = this.value;

    if (tool === 'bold' && range) {
      value = [value.slice(0, start), '**', value.slice(start)].join('');
      value = [value.slice(0, end + 2), '**', value.slice(end + 2)].join('');
    }

    if (tool === 'link' && range) {
      value = [value.slice(0, start), '[', value.slice(start)].join('');
      value = [
        value.slice(0, end + 1),
        '](https://somelink.com)',
        value.slice(end + 1)
      ].join('');
    }

    if (tool === 'bullets') {
      value = value + bulletsTemplate;
    }

    // Set the value locally
    this.value = value;

    // Show value to the user
    textarea.innerText = value;

    // The parent component needs to be triggered because the value has changed.
    const ev = new KeyboardEvent('keyup');
    textarea.dispatchEvent(ev);
  }
}
