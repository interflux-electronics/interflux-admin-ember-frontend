import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | error/generic', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<Error::Generic />`);

    assert.ok(this.element.querySelector('[role="alert"]'));
    assert.ok(this.element.querySelector('p'));
    assert.ok(this.element.querySelector('button'));
  });
});
