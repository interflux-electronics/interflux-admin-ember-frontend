import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | <Fieldset>', function (hooks) {
  setupRenderingTest(hooks);

  test('it links <label> and <input> IDs', async function (assert) {
    assert.expect(4);

    const id = '123';
    const str = 'First name';

    this.set('id', id);
    this.set('label', str);

    // Template block usage:
    await render(hbs`
      <Fieldset
        @id={{this.id}}
        @label={{this.label}}
      >
        <Form::Input @id={{this.id}} />
      </Fieldset>
    `);

    const field = this.element.querySelector('fieldset');
    const label = this.element.querySelector('label');
    const input = this.element.querySelector('input');

    assert.strictEqual(field.id, `field-${id}`);
    assert.strictEqual(input.id, `input-${id}`);
    assert.strictEqual(label.getAttribute('for'), `input-${id}`);
    assert.strictEqual(label.innerText, str);
  });
});
