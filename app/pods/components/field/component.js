import Component from '@glimmer/component';

// locked          show lock icon
// no-changes      show nothing
// dirty-invalid   warning
// dirty-valid     save button
// saving          disabled save button "Saving...""
// save-success    Done! --> timeout to idle
// save-fail       Error message --> hide on dismiss or when user starts correcting

export default class FieldComponent extends Component {
  // args.size
  // args.theme
  // args.hasFocus
  // args.hasHover
  // args.isDirty

  get classes() {
    return [
      this.args.component,
      this.theme,
      this.focus,
      this.hover,
      this.dirty
    ].join(' ');
  }

  get theme() {
    return this.args.theme || 'primary';
  }

  get focus() {
    return this.args.hasFocus ? 'focus' : 'no-focus';
  }

  get hover() {
    return this.args.hasHover ? 'hover' : 'no-hover';
  }

  get dirty() {
    return this.args.isDirty ? 'dirty' : 'clean';
  }
}
