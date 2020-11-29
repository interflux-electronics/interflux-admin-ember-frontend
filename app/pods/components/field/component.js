import Component from '@glimmer/component';

import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class FieldComponent extends Component {
  @service form;
  @service auth;
  @service api;

  id; // Unique across the app

  constructor() {
    super(...arguments);
    this.id = this.form.getUniqueId();
  }

  // STATE

  // The value we're exposing to the user with this <Field> can be in 5 different states:
  get state() {
    // Server errors
    if (this.error) {
      return 'error';
    }

    // Validation warnings
    if (this.warning) {
      return 'warning';
    }

    // Valid and saving
    if (this.isSaving) {
      return 'saving';
    }

    // Valid and dirty
    if (this.isDirty) {
      return 'dirty';
    }

    // Saved, no changes
    return 'idle';
  }

  @tracked hasFocus = false;
  @tracked hasHover = false;
  @tracked isSaving = false;
  @tracked error;

  get isDirty() {
    return this.value !== this.lastSavedValue;
  }

  get warnings() {
    return null;
  }

  // FOCUS

  @action
  onFocus() {
    this.hasFocus = true;
  }

  @action
  onBlur() {
    this.hasFocus = false;
  }

  // HOVER

  @action
  onMouseOver() {
    this.hasHover = true;
  }

  @action
  onMouseOut() {
    this.hasHover = false;
  }

  // SAVE

  @tracked lastSavedValue;

  @action
  async save() {
    console.debug('saving');

    // Reset errors, allow second save attempt
    this.error = null;

    // Show saving state
    this.isSaving = true;

    // Remember the value
    const value = this.value;

    this.args.record
      .save({
        adapterOptions: {
          whitelist: [this.args.attribute || this.args.relation]
        }
      })
      .then(() => {
        console.debug('save successful');
        this.lastSavedValue = value;
      })
      .catch((response) => {
        console.error('save failed');

        // Show error in console
        this.api.logError(response);

        // Show error to user
        if (response.errors && response.errors[0] && response.errors[0].code) {
          const code = response.errors[0].code;
          this.error = code;
        } else {
          this.error = 'unknown';
        }
      })
      .finally(() => {
        this.isSaving = false;
      });
  }
}
