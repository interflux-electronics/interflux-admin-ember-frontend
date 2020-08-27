import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | secure/user/help', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:secure/user/help');
    assert.ok(route);
  });
});
