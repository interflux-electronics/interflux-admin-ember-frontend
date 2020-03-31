// This adapter is responsible for converting all outgoing API requests to be
// formatted according the JSON API specs.
// https://jsonapi.org/
// https://www.emberjs.com/api/ember-data/release/classes/DS.JSONAPIAdapter
//
// The fetch mixin is responsible for Ember Data to use HTML5 fetch() polyfill
// instead of the dreaded jQuery $.ajax().
// https://github.com/ember-cli/ember-fetch
//
import JSONAPIAdapter from 'ember-data/adapters/json-api';
import { pluralize } from 'ember-inflector';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends JSONAPIAdapter {
  @service api;

  host = this.api.host;
  namespace = this.api.namespace;

  // Dynamically set the headers on each request.
  // Docs: https://guides.emberjs.com/release/models/customizing-adapters/
  get headers() {
    return this.api.headers;
  }

  // Convert the Ember model name to something Rails would recognise:
  // Rails expects underscored resources
  // Rails expects pluralized resources
  pathForType(type) {
    return pluralize(type);
  }

  // Never show local records until after findAll has completed loading the remote records
  // https://api.emberjs.com/ember-data/3.10/classes/DS.Adapter/methods?anchor=shouldReloadAll
  shouldReloadAll() {
    return true;
  }
}
