import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { hash } from 'rsvp';
import { action } from '@ember/object';

export default class SecureRoute extends Route {
  @service auth;
  @service store;

  // Redirect user back to login if the auth token is missing
  beforeModel() {
    if (!this.auth.token || !this.auth.uuid) {
      console.warn('Missing auth token / UUID');
      console.warn('Reseting authentication data');
      console.warn('Redirecting to login');
      this.auth.reset();
    }
  }

  // Fetch the user record matching the auth token.
  // In case the token is invalid or expired a 401 Unauthorized will come back.
  // All 401 responses will automatically trigger a redirect to the login page
  // and resets all authentication data.
  // See: app/initializers/handle-route-errors.js
  model() {
    return hash({
      user: this.store.findRecord('user', this.auth.uuid, {
        include: ['person'].join(',')
      })
    });
  }

  afterModel(model) {
    this.auth.user = model.user;
  }

  @action
  error(response) {
    console.error(response);
    console.warn('Authentication failed...');
    console.warn('Reseting authentication data');
    console.warn('Showing user button to login.');

    // Reset all auth tokens and data without redirecting to login.
    this.auth.reset(false);

    // Returning true allows the error to bubble up the route tree which triggers the error
    // templates to show
    return true;
  }
}
