import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { action } from '@ember/object';

export default class AuthService extends Service {
  @service api;
  @service store;
  @service router;

  token = null;
  user = null;
  expiry = null;

  @task()
  *getToken(email, password) {
    const url = `${this.api.host}/${this.api.namespace}/auth-token`;

    const request = new Request(url, {
      method: 'POST',
      mode: 'cors',
      headers: new Headers(this.api.headers),
      body: JSON.stringify({ email, password })
    });

    const response = yield fetch(request).catch(error => {
      return console.error(error);
    });

    // Read the JSON from the Body (async promise)
    // When back-end sends no JSON back, then status code should be 204
    const json = yield response.json().catch(error => {
      return console.error(error);
    });

    const { token, expiry } = json.auth;

    this.remember(token, expiry);

    this.router.transitionTo('secure.index');
  }

  remember(token, expiry) {
    this.token = token;
    this.expiry = expiry;
    localStorage.setItem('token', token);
    localStorage.setItem('expiry', expiry);
  }

  revive() {
    this.token = localStorage.getItem('token');
    this.expiry = localStorage.getItem('expiry');
  }

  @action
  reset() {
    this.token = null;
    this.user = null;
    this.expiry = null;
    localStorage.clear();
    this.store.unloadAll();
    this.router.transitionTo('login');
  }
}
