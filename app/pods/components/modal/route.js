import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ModalRoute extends Route {
  @service modal;

  renderTemplate() {
    this.render({
      into: 'application',
      outlet: 'modal'
    });
  }

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
    this.modal.setProperties({
      active: false,
      scroll: 0
    });
    const scroll = this.modal.scroll;
    window.scrollTo(0, scroll);
  }
}
