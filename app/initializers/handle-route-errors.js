import config from 'interflux/config/environment';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import {
  AbortError,
  ConflictError,
  InvalidError,
  NotFoundError,
  ServerError,
  TimeoutError,
  UnauthorizedError,
  ForbiddenError
} from '@ember-data/adapter/error';

const { isDevelopment, isProduction, isTest } = config;

// For AJAX
// https://github.com/ember-cli/ember-ajax/issues/57

// Documentation on DS.AdaptorErrors
// http://docs.w3cub.com/ember/classes/ds.adaptererror/

export function initialize() {
  Route.reopen({
    auth: service(),

    actions: {
      error(error) {
        // The request to the server was aborted
        // https://emberjs.com/api/ember-data/3.0/classes/DS.AbortError
        if (error instanceof AbortError) {
          if (isProduction) {
            if (navigator.onLine) {
              console.error('Looks like the production API is down.');
              // TODO: Log error
            } else {
              console.error('Looks like you are offline.');
              // TODO: Notify user
            }
          } else if (isDevelopment) {
            console.error('Looks like your local API is down.');
          } else if (isTest) {
            console.error('Looks like we did not hit Mirage.');
          } else {
            console.error('This should never show.');
            debugger;
          }
        }
        if (error instanceof InvalidError) {
          // https://emberjs.com/api/ember-data/3.0/classes/DS.InvalidError
          // Ember Data expects a source/pointer
          console.error(
            '422 - This request got rejected because of invalid data.'
          );
        } else if (error instanceof UnauthorizedError) {
          console.error('401 - You are not authorised to make this request.');
          console.warn('Reseting authentication data');
          console.warn('Redirecting to login');
          this.auth.reset();
        } else if (error instanceof ForbiddenError) {
          console.error('403 - You are not allowed to make this request.');
        } else if (error instanceof NotFoundError) {
          console.error('404 - The API does not know this route.');
        } else if (error instanceof ConflictError) {
          console.error('409 - The request is conflicting.');
        } else if (error instanceof ServerError) {
          console.error('500 - The server is down!');
        } else if (error instanceof TimeoutError) {
          console.error(
            '504 - The request timed out. Check your network and API load.'
          );
        } else {
          console.error('Unknown error');
          console.error(error);
          console.debug('DEBUG: Is Rails running?');
          console.debug('DEBUG: Do you have a model for this resource?');
          // Unknown error
          // debugger;
          // try {
          //   const parentRoute = relativeRoute(this.routeName, '../');
          //   this.transitionTo(parentRoute);
          // } catch (err) {
          //   this.transitionTo('index');
          // }
          // const firstError = error.errors[0];
          // console.error(firstError.status, firstError.code, firstError.detail);
        }
      }
    }
  });
}

export default {
  name: 'handle-route-errors',
  initialize
};
