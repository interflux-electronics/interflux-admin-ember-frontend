import Component from '@glimmer/component';

// locked          show lock icon
// no-changes      show nothing
// dirty-invalid   warning
// dirty-valid     save button
// saving          disabled save button "Saving...""
// save-success    Done! --> timeout to idle
// save-fail       Error message --> hide on dismiss or when user starts correcting

export default class FieldComponent extends Component {
  get classes() {
    return [this.size, this.theme].join(' ');
  }

  get size() {
    return this.args.size || 'medium';
  }

  get theme() {
    return this.args.theme || 'primary';
  }
}
