import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | form', function (hooks) {
  setupTest(hooks);

  test('it generates unique IDs', function (assert) {
    assert.expect(3);

    const service = this.owner.lookup('service:form');

    const a = service.getUniqueId();
    const b = service.getUniqueId();
    const c = service.getUniqueId();

    assert.strictEqual(a, 1);
    assert.strictEqual(b, 2);
    assert.strictEqual(c, 3);
  });
});
