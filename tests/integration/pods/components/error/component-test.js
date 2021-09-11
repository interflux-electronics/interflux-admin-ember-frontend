import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | error', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`
      <Error>
        <p>Foo</p>
      </Error>
    `);

    assert.ok(this.element.querySelector('[role="alert"]'));
    assert.ok(this.element.querySelector('p'));
    assert.equal(this.element.querySelector('p').textContent, 'Foo');
  });
});
