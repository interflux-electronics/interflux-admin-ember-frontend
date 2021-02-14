import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | dot-dot-dot-menu', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(3);

    await render(hbs`
      <DotDotDotMenu>
        <Button @text="open" />
        <Button @text="remove" />
      </DotDotDotMenu>
    `);

    const button = this.element.querySelector('.button.ellipsis-vertical');

    assert.ok(button);
    assert.notOk(this.element.querySelector('.dropdown'));

    await click('button');

    assert.ok(this.element.querySelector('.dropdown'));
  });
});
