import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | <Field>', function (hooks) {
  setupRenderingTest(hooks);

  test('it links <label> and <input> IDs', async function (assert) {
    assert.expect(3);

    const id = 'field-123';
    const str = 'First name';

    this.set('id', id);
    this.set('label', str);

    // Template block usage:
    await render(hbs`
      <Field
        @id={{this.id}}
        @label={{this.label}}
      >
        <input id={{this.id}}>
      </Field>
    `);

    const label = this.element.querySelector('label');
    const input = this.element.querySelector('input');

    assert.equal(input.id, id);
    assert.equal(label.getAttribute('for'), id);
    assert.equal(label.innerText, str);
  });
});
