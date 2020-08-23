import EmberRouter from '@ember/routing/router';
import config from 'interflux/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('secure', function () {
    this.route('products-loading');
    this.route('products-error');
    this.route('products', function () {
      this.route('product', { path: '/:id' });
    });

    this.route('families-loading');
    this.route('families-error');
    this.route('families', function () {
      this.route('family', { path: '/:id' });
    });

    this.route('processes-loading');
    this.route('processes-error');
    this.route('processes', function () {
      this.route('process', { path: '/:id' });
    });

    this.route('features-loading');
    this.route('features-error');
    this.route('features', function () {
      this.route('feature', { path: '/:id' });
    });

    this.route('documents-loading');
    this.route('documents-error');
    this.route('documents', function () {
      this.route('document', { path: '/:id' });
    });

    this.route('images-loading');
    this.route('images-error');
    this.route('images', function () {
      this.route('image', { path: '/:id' });
    });

    this.route('videos-loading');
    this.route('videos-error');
    this.route('videos', function () {
      this.route('video', { path: '/:id' });
    });

    this.route('companies-loading');
    this.route('companies-error');
    this.route('companies', function () {
      this.route('company', { path: '/:id' });
    });

    this.route('people-loading');
    this.route('people-error');
    this.route('people', function () {
      this.route('person', { path: '/:id' });
    });

    this.route('orders-loading');
    this.route('orders-error');
    this.route('orders', function () {
      this.route('order', { path: '/:id' });
    });

    this.route('leads-loading');
    this.route('leads-error');
    this.route('leads', function () {
      this.route('lead', { path: '/:id' });
    });
  });

  this.route('login');
  this.route('help');
  this.route('loading');

  this.route('catchall', { path: '*:' });
});
