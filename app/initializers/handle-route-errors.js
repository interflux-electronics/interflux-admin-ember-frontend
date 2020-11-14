import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

// For AJAX
// https://github.com/ember-cli/ember-ajax/issues/57

// Documentation on DS.AdaptorErrors
// http://docs.w3cub.com/ember/classes/ds.adaptererror/

export function initialize() {
  Route.reopen({
    auth: service(),
    api: service(),

    actions: {
      error(response) {
        console.error(`error() on "${this.routeName}" route`);

        this.api.logError(response);

        // Returning true allows the error to bubble up the route tree which triggers the error
        // templates to show
        return true;
      }
    }
  });
}

export default {
  name: 'handle-route-errors',
  initialize
};
