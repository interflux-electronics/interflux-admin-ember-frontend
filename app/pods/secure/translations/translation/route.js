import ModalRoute from 'interflux/pods/components/modal/route';
import { hash } from 'rsvp';

export default class TranslationRoute extends ModalRoute {
  model(params) {
    return hash({
      translation: this.store.peekRecord('translation', params.id, {
        reload: true
      })
    });
  }

  // HACK: when navigating into a subset route, then out and back into another, the controller
  // of the first visit linger. With this hack we manually reset them.
  //
  // Documentation
  // https://api.emberjs.com/ember/3.24/classes/Route/methods?anchor=resetController
  //
  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== 'error') {
      controller.set('loadingSuggestions', false);
      controller.set('suggestions', null);
      controller.set('isSaving', false);
      controller.set('lastSavedNative', null);
      controller.set('showError', false);
    }
  }
}
