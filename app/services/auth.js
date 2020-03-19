import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency-decorators';

export default class AuthService extends Service {
  @service api;
  @service router;

  token = null;
  user = null;

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
    console.debug('auth.remember()', { token, expiry });
    this.token = token;
    this.expiry = expiry;
    localStorage.setItem('token', token);
    localStorage.setItem('expiry', expiry);
  }

  revive() {
    console.debug('auth.revive()');
    this.token = localStorage.getItem('token');
    this.expiry = localStorage.getItem('expiry');
  }

  forget() {
    console.debug('auth.forget()');
    this.token = null;
    this.expiry = null;
    localStorage.removeItem('token');
    localStorage.removeItem('expiry');
  }
}

// import Service from '@ember/service';
// import { inject as service } from '@ember/service';
// import { task } from 'ember-concurrency';
//
// export default Service.extend({
//   store: service(),
//   fetch: service(),
//
//   user: undefined, // The record of the authenticated user
//   token: undefined, // The authentication token given by the API
//   expiry: undefined, // The date at which the API will invalidate the auth token
//
//   // TODO
//   // fetchUser: task(function*() {
//   //   const token = this.token || 'no-token';
//   //   const payload = { token };
//   //   const data = yield this.fetch.post.perform('/auth/fetch-user', payload);
//   //
//   //   const validToken = data.response.status === 200 ? true : false;
//   //
//   //   if (validToken) {
//   //     console.debug('Auth | Token is valid');
//   //   } else {
//   //     console.warn('Auth | Token is not valid');
//   //     throw 'Auth token is not valid';
//   //   }
//   //
//   //   // // The API returns the user with ID, needed in verifyPassword()
//   //   // this.store.push(data.json);
//   //   //
//   //   // // Find the user in the store and set it on this service
//   //   // const user = this.store.peekRecord('user', data.json.data.id);
//   //   // this.set('user', user);
//   // }),
//
//   verifyToken: task(function*() {
//     const token = this.token || 'no-token';
//     const payload = { token };
//     const data = yield this.fetch.post.perform('/auth/verify-token', payload);
//
//     const validToken = data.response.status === 200 ? true : false;
//
//     if (validToken) {
//       console.debug('Auth | Token is valid');
//     } else {
//       console.warn('Auth | Token is not valid');
//       throw 'Auth token is not valid';
//     }
//   }),
//

//
//   restore() {
//     if (this.isFastBoot) {
//       return;
//     }
//     const token = localStorage.getItem('token');
//     const expiry = localStorage.getItem('expiry');
//
//     if (token) {
//       console.debug('Auth | Found token in localStorage, restoring...');
//     } else {
//       console.debug('Auth | No token found in localStorage.');
//     }
//
//     this.setProperties({ token, expiry });
//   },
//
//   logout() {
//     console.debug('Auth | Log out');
//     this.forget();
//     localStorage.clear();
//     this.store.unloadAll();
//   }
//
//   // setAttr(key, value) {
//   //   console.log('Auth service: setting', key, 'to', value);
//   //   this.set(key, value);
//   // },
// });
