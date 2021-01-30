import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | field/date', function (hooks) {
  setupRenderingTest(hooks);

  // test('it renders', async function(assert) {
  //   // Set any properties with this.set('myProperty', 'value');
  //   // Handle any actions with this.set('myAction', function(val) { ... });
  //
  //   await render(hbs`<Field::Date />`);
  //
  //   assert.equal(this.element.textContent.trim(), '');
  //
  //   // Template block usage:
  //   await render(hbs`
  //     <Field::Date>
  //       template block text
  //     </Field::Date>
  //   `);
  //
  //   assert.equal(this.element.textContent.trim(), 'template block text');
  // });

  test('it renders', async function (assert) {
    this.set('record', EmberObject.create({ foo: 'bar' }));
    this.set('options', [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' }
    ]);

    await render(hbs`
      <Field::Date
        @label='Start time'
        @legend='Enter UTC times.'
        @record={{webinar}}
        @attribute='startTime'
      >
      </Field::Date>
      <Field::Date
        @record={{this.record}}
        @attribute="foo"
        @options={{this.options}}
      />
    `);

    assert.equal(this.element.querySelectorAll('[role="radio"]').length, 3);
  });
});
