import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class AuthService extends Service {
  @service api;
  @service store;
  @service router;

  @tracked token = null;
  @tracked user = null;
  @tracked expiry = null;
  @tracked error = null;

  @task()
  *getToken(email, password) {
    this.error = null;

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
    const body = yield response.json().catch(error => {
      return console.error(error);
    });

    if (response.status !== 200) {
      console.warn('Could not log in');
      console.warn({ response, body });
      this.error = `${response.status} ${response.statusText}`;
      return;
    }

    const { token, expiry } = body.auth;

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
