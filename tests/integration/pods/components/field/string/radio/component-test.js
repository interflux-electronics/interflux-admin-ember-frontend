import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import EmberObject from '@ember/object';

module('Integration | Component | field/string/radio', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(1);

    this.set('record', EmberObject.create({ foo: 'bar' }));
    this.set('options', [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' }
    ]);

    await render(hbs`
      <Field::String::Radio
        @record={{this.record}}
        @attribute="foo"
        @options={{this.options}}
      />
    `);

    assert.strictEqual(
      this.element.querySelectorAll('[role="radio"]').length,
      3
    );
  });
});
