import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class FieldStringComponent extends Component {
  @tracked hasFocus = false;

  @action
  handleFocus(bool) {
    this.hasFocus = bool;
  }
}
