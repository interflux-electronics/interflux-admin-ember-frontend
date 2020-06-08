import Component from '@glimmer/component';

export default class FieldComponent extends Component {
  // locked          show lock icon
  // no-changes      show nothing
  // dirty-invalid   warning
  // dirty-valid     save button
  // saving          disabled save button "Saving...""
  // save-success    Done! --> timeout to idle
  // save-fail       Error message --> hide on dismiss or when user starts correcting
}
