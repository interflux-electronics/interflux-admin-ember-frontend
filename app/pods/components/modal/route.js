import BaseRoute from 'interflux/pods/base/route';
import { service } from '@ember/service';

export default class ModalRoute extends BaseRoute {
  @service modal;

  // Prevent <main> page from scrolling
  activate() {
    this.modal.setProperties({
      active: true,
      scroll: window.pageYOffset || document.documentElement.scrollTop
    });
    window.scrollTo(0, 0);
  }

  // Allow <main> page to scroll again
  deactivate() {
    const scroll = this.modal.scroll;
    this.modal.setProperties({
      active: false,
      scroll: 0
    });
    window.scrollTo(0, scroll);
  }
}
