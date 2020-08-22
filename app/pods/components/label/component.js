import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class LabelComponent extends Component {
  @tracked showHint = false;

  @action
  toggleHint() {
    this.showHint = !this.showHint;
  }
}
