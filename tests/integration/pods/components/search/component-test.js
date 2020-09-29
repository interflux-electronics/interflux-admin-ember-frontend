import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import EmberObject from '@ember/object';

module('Integration | Component | <Search>', function (hooks) {
  setupRenderingTest(hooks);

  test('it render @id and @theme', async function (assert) {
    assert.expect(2);

    const id = 'field-123';
    const theme = 'primary';
    const arr = [
      EmberObject.create({ firstName: 'Tom' }),
      EmberObject.create({ firstName: 'Jan' }),
      EmberObject.create({ firstName: 'Daniel' })
    ];

    this.set('id', id);
    this.set('theme', theme);
    this.set('recordsForQuery', arr);
    this.set('currentRecord', arr[0]);
    this.set('filterOn', 'firstName');

    // Template block usage:
    await render(hbs`
      <Search
        @id={{this.id}}
        @theme="primary"
        @currentRecord={{this.currentRecord}}
        @recordsForQuery={{this.recordsForQuery}}
        @filterOn={{this.filterOn}}
      />
    `);

    const outer = this.element.querySelector('.search');
    const input = this.element.querySelector('input');

    assert.equal(input.id, id);
    assert.ok(outer.classList.contains(theme));
  });
});
