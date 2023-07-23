import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class LoginController extends Controller {
  @service auth;
  @service api;
  @service router;

  email = 'jw@interflux.au';
  password = 'tbFRkgMfqQuDN9qeyEpzTC9kbnncsFHPFjYyMxwJnEGEPPJKXjiTjXd4AdQnyKnY';
  loading = false;
  error;

  @action
  submit() {
    this.logIn();
  }

  @action
  async logIn() {
    this.loading = true;
    this.error = null;

    const fail = (error) => {
      this.loading = false;
      this.error = 'Something went wrong.';
      console.error(error);
    };

    const error = (response) => {
      this.loading = false;
      this.error = `${response.status} ${response.statusText}`;
      console.error(response);
    };

    const { email, password } = this;

    const url = `${this.api.host}/v1/auth/token`;

    const request = new Request(url, {
      method: 'POST',
      mode: 'cors',
      headers: new Headers(this.api.headers),
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const response = await fetch(request).catch(fail);

    if (response.status !== 201) {
      console.error('Unable to authenticate');
      error(response);
      return;
    }

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
