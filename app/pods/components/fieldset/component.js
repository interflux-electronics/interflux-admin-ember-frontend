import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

// <Fieldset
//   @label='First name'
//   @legend='This is used for A, B and C.'
//   @lock='This field is locked because auto-generated.'
//   @error='Please enter a value'
// >

export default class FieldsetComponent extends Component {
  get classes() {
    return [
      this.args.component || 'no-component',
      this.args.theme || 'primary',
      this.args.state || 'no-state',
      this.args.hasFocus ? 'focus' : 'no-focus'
    ].join(' ');
  }

  @action
  onInsert(fieldset) {
    if (this.args.onInsert) {
      this.args.onInsert(fieldset);
    }
  }

  @tracked view = 'nothing';

  get showTooltip() {
    return this.view === 'tooltip';
  }

  get showLock() {
    return this.view === 'lock';
  }

  get showError() {
    return this.view === 'error';
  }

  @action onClickTooltip() {
    this.view = this.view !== 'tooltip' ? 'tooltip' : null;
  }

  @action onClickLock() {
    this.view = this.view !== 'lock' ? 'lock' : null;
  }

  @action onClickError() {
    this.view = this.view !== 'error' ? 'error' : null;
  }
}
