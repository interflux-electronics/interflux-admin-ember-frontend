import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class TranslationRoute extends ModalRoute {
  model(params) {
    return hash({
      translation: this.store.findRecord('translation', params.id, {
        include: ['translation_events'].join(',')
      })
    });
  }
}
