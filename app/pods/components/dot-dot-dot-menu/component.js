import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class DotDotDotMenuComponent extends Component {
  @tracked showDropdown = false;

  @action
  onClick() {
    this.showDropdown = true;
  }

  @action
  onInsert(wrapper) {
    const handleEvent = (event) => {
      if (!wrapper.contains(event.target)) {
        this.showDropdown = false;
      }
    };

    document.addEventListener('click', handleEvent);
  }
}
