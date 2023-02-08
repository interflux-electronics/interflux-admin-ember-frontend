import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import EmberObject from '@ember/object';

module('Integration | Component | field/date-string', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(5);

    this.set('event', EmberObject.create({ startDate: '2023-10-16' }));

    await render(hbs`
      <Field::DateString
        @label='Start date'
        @record={{this.event}}
        @attribute='startDate'
      />
    `);

    const inputs = this.element.querySelectorAll('input');

    assert.strictEqual(inputs.length, 3);

    const label = this.element.querySelector('label');

    assert.strictEqual(label.innerText, 'Start date');

    const YYYY = this.element.querySelector('input.YYYY');
    const MM = this.element.querySelector('input.MM');
    const DD = this.element.querySelector('input.DD');

    assert.strictEqual(YYYY.value, '2023');
    assert.strictEqual(MM.value, '10');
    assert.strictEqual(DD.value, '16');
  });
});
