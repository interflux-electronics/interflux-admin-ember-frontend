import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { action } from '@ember/object';

// This route is the gatekeeper of all authenticated routes.
// It will fetch the auth user. If a user is returned, continue.
// If no user is returned, redirect back to login.
// The auth user is stored in an HTTP-only cookie which only the backend can access.

export default class SecureRoute extends Route {
  @service api;
  @service auth;
  @service store;
  @service router;

  // Here we fetch the auth user.
  model() {
    const url = `${this.api.host}/v1/auth/user`;

    const request = new Request(url, {
      method: 'GET',
      mode: 'cors',
      headers: new Headers(this.api.headers),
      credentials: 'include'
    });

    return fetch(request)
      .then((response) => {
        return response.ok ? response.json() : null;
      })
      .then((data) => {
        if (data) {
          this.store.pushPayload('user', data);
          return this.store.peekRecord('user', data.data.id);
        } else {
          return null;
        }
      });
  }

  // Here we store the auth user in the auth service so all components and routes can access it.
  afterModel(model) {
    if (model) {
      this.auth.user = model;
    } else {
      console.error('no auth user');
      this.store.unloadAll();
      this.router.transitionTo('login');
    }
  }

  @action
  error(msg) {
    console.error('abc');
    // this.store.unloadAll();
    // this.router.transitionTo('login');

    // Unload store and redirect user to login.
    // this.auth.reset(false);

    // Returning true allows the error to bubble up the route tree which triggers the error
    // templates to show
    return false;
  }
}
