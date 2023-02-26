import Component from '@glimmer/component';

import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class FieldComponent extends Component {
  @service form;
  @service auth;
  @service api;

  id; // Unique across the app

  constructor() {
    super(...arguments);
    this.id = this.args.id || this.form.getUniqueId();
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
    return this.args.localSave || !this.args.noSave
      ? false
      : this.value !== this.lastSavedValue;
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

  @tracked lastSavedValue = null;

  @action
  onSave() {
    this.save();
  }

  async save(record, options) {
    const _record = record || this.args.record;
    const _options = options || {
      adapterOptions: {
        whitelist: [this.args.attribute || this.args.relation]
      }
    };

    // Do not persist to database if localSave
    if (this.args.localSave) {
      return false;
    }

    // Reset errors, allow second save attempt
    this.error = null;

    // Show saving state
    this.isSaving = true;

    // Remember the value
    const value = this.value;

    if (this.args.beforeSave) {
      await this.args.beforeSave();
    }

    const success = () => {
      this.lastSavedValue = value;
      if (this.args.afterSave) {
        this.args.afterSave(value);
      }
    };

    const fail = (response) => {
      // Show error in console
      this.api.logError(response);

      // Show error to user
      if (response.errors && response.errors[0] && response.errors[0].code) {
        const code = response.errors[0].code;
        this.error = code;
      } else {
        this.error = 'unknown';
      }
    };

    const done = () => {
      this.isSaving = false;
    };

    _record.save(_options).then(success).catch(fail).finally(done);
  }
}
