import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class DotDotDotMenuComponent extends Component {
  @tracked showDropdown = false;

  @action
  open() {
    this.showDropdown = true;
  }

  @action
  close() {
    this.showDropdown = false;
  }
}
