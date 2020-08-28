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
    console.log('activate', this.routeName);
    this.modal.setProperties({
      active: true,
      scroll: window.pageYOffset || document.documentElement.scrollTop
    });
    console.log(window.pageYOffset || document.documentElement.scrollTop);
    window.scrollTo(0, 0);
  }

  // Allow <main> page to scroll again
  deactivate() {
    console.log('deactivate', this.routeName);
    const scroll = this.modal.scroll;
    this.modal.setProperties({
      active: false,
      scroll: 0
    });
    console.log(scroll);
    window.scrollTo(0, scroll);
  }
}
