import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class ProductsProductRoute extends Route {
  @service store;
  @service modal;

  model(params) {
    return hash({
      lead: this.store.findRecord('lead', params.id, {})
    });
  }

  renderTemplate() {
    this.render({
      into: 'application',
      outlet: 'modal'
    });
  }

  // Prevent <main> page from scrolling
  activate() {
    console.debug('activate');
    this.modal.setProperties({
      active: true,
      scroll: window.pageYOffset || document.documentElement.scrollTop
    });
    console.log(window.pageYOffset || document.documentElement.scrollTop);
    window.scrollTo(0, 0);
  }

  // Allow <main> page to scroll again
  deactivate() {
    console.debug('deactivate');
    const scroll = this.modal.scroll;
    this.modal.setProperties({
      active: false,
      scroll: 0
    });
    console.log(scroll);
    window.scrollTo(0, scroll);
  }
}
