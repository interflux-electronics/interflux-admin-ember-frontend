import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | secure/families-error', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:secure/families-error');
    assert.ok(route);
  });
});
