import ApplicationSerializer from 'interflux/serializers/application';

export default class ProductSerializer extends ApplicationSerializer {
  //
  // Here we rename product.status to product.lifeCycle to avoid conflicts with Ember.
  //
  // The property "status" conflicts with Ember. If product.status === 'new' then Ember will treat
  // that record as new and unsaved, which in turn prevents it from being sent up when assigning
  // processes and qualities to products.
  //
  // Docs: https://guides.emberjs.com/release/models/customizing-serializers/#toc_attribute-names
  //
  attrs = {
    lifeCycle: 'status'
  };
}
