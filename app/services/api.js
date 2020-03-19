import Service from '@ember/service';
import ENV from 'interflux/config/environment';
import { inject as service } from '@ember/service';

export default class ApiService extends Service {
  @service auth;

  // Where the API lives
  // In production: https://api.interflux.com
  // In developement: http://localhost:3000
  host = ENV.apiHost;

  // The base path for all requests this app makes to the API
  // Currently this is "v1/admin"
  //
  // In production:
  // GET https://api.interflux.com/v1/admin/countries
  // POST https://api.interflux.com/v1/admin/product
  //
  // In development:
  // GET http://localhost:3000/v1/admin/countries
  // POST http://localhost:3000/v1/admin/product
  //
  namespace = ENV.apiNamespace;

  // The headers to add to every request to our API.
  // Docs: https://guides.emberjs.com/release/models/customizing-adapters/
  get headers() {
    const headers = {};

    // With the Content-Type header 'application/vnd.api+json' we say that
    // what we send to the API is JSON API compliant.
    headers['Content-Type'] = 'application/vnd.api+json';

    // With the Accept header 'application/vnd.api+json' we say that what we
    // expect back from the API is JSON API compliant data.
    headers['Accept'] = 'application/vnd.api+json';

    // The Authorization header is a JWT token added to all requests and
    // verified by the back-end on each protected endpoint.
    headers['Authorization'] = this.auth.token || 'no-token';

    return headers;
  }
}
