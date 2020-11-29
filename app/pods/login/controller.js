import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class LoginController extends Controller {
  @service auth;
  @service api;
  @service router;

  email;
  password;
  loading = false;
  error;

  @action
  submit() {
    this.logIn();
    // this.auth.getToken.perform(this.email, this.password);
  }

  @action
  async logIn() {
    const { email, password } = this;

    this.error = null;
    this.loading = true;

    const url = `${this.api.host}/${this.api.namespace}/auth-token`;

    const request = new Request(url, {
      method: 'POST',
      mode: 'cors',
      headers: new Headers(this.api.headers),
      body: JSON.stringify({ email, password })
    });

    const fail = (error) => {
      this.loading = false;
      return console.error(error);
    };

    const response = await fetch(request).catch(fail);

    // Read the JSON from the Body (async promise)
    // When back-end sends no JSON back, then status code should be 204
    const body = await response.json().catch(fail);

    this.loading = false;

    if (response.status !== 200) {
      console.warn('Could not log in');
      console.warn({ response, body });
      this.error = `${response.status} ${response.statusText}`;
      return;
    }

    const { token, expiry, uuid } = body.auth;

    this.auth.remember('token', token);
    this.auth.remember('expiry', expiry);
    this.auth.remember('uuid', uuid);

    this.email = null;
    this.password = null;

    this.router.transitionTo('secure.index');
  }

  @action
  onKeyDown(event) {
    if (event.code === 'Enter') {
      this.submit();
    }
  }

  @action
  onKeyUp(event) {
    const input = event.target;
    const key = input.id.replace('input-', '');
    const value = input.value;

    this[key] = value;
  }
}
