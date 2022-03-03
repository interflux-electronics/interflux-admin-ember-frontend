import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';

export default class PageComponent extends Component {
  @service modal;

  get safeStyle() {
    if (!this.modal.active) {
      return null;
    }

    return htmlSafe(`top: -${this.modal.scroll}px`);
  }
}
