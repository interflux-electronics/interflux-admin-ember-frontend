import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import EmberObject from '@ember/object';

module('Integration | Component | field/date', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(4);

    this.set('webinar', EmberObject.create({ startTime: 1611995580698 }));

    await render(hbs`
      <Field::Date
        @label='Start time'
        @legend='Enter UTC times.'
        @record={{webinar}}
        @attribute='startTime'
      />
    `);

    const input = this.element.querySelector('input[type="datetime-local"]');
    const label = this.element.querySelector('label');
    const legend = this.element.querySelector('legend');

    assert.ok(input);
    assert.equal(input.value, '2021-01-30T08:33');
    assert.equal(label.innerText, 'Start time');
    assert.equal(legend.innerText, 'Enter UTC times.');
  });
});
