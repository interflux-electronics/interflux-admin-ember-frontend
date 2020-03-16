import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('images', function() {
    this.route('image', { path: '/:uuid' });
  });
  this.route('products', function() {
    this.route('product', { path: '/:uuid' });
  });
  this.route('documents', function() {
    this.route('document', { path: '/:uuid' });
  });
  this.route('companies', function() {
    this.route('company', { path: '/:uuid' });
  });
  this.route('people', function() {
    this.route('person', { path: '/:uuid' });
  });
  this.route('leads', function() {
    this.route('lead', { path: '/:uuid' });
  });
  this.route('countries', function() {
    this.route('country', { path: '/:uuid' });
  });
  this.route('languages', function() {
    this.route('language', { path: '/:uuid' });
  });

  this.route('loading');
});
