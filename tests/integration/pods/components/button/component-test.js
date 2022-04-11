import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | <Button>', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders <a> to a route', async function (assert) {
    assert.expect(3);

    this.set('text', 'Click me');
    this.set('route', 'index');

    await render(hbs`
      <Button
        @route={{this.route}}
        @text={{this.text}}
      />
    `);

    const a = this.element.querySelector('a');

    assert.notEqual(a, undefined);
    assert.strictEqual(a.textContent.trim(), this.text);
    assert.strictEqual(a.target, '');
  });

  test('it renders <a> to an external URL', async function (assert) {
    assert.expect(4);

    this.set('text', 'Click me');
    this.set('url', 'https://interflux.com/');

    await render(hbs`
      <Button
        @url={{this.url}}
        @text={{this.text}}
      />
    `);

    const a = this.element.querySelector('a');

    assert.notEqual(a, undefined);
    assert.strictEqual(a.textContent.trim(), this.text);
    assert.strictEqual(a.href, this.url);
    assert.strictEqual(a.target, '_blank');
  });

  test('it renders <button> which fires @onClick', async function (assert) {
    assert.expect(4);

    let buttonWasClicked = false;

    this.set('text', 'Click me');
    this.set('buttonWasClicked', 'Click me');
    this.set('onClick', () => {
      buttonWasClicked = true;
    });

    await render(hbs`
      <Button
        @text={{this.text}}
        @onClick={{this.onClick}}
      />
    `);

    const button = this.element.querySelector('button');

    assert.notEqual(button, undefined);
    assert.strictEqual(button.textContent.trim(), this.text);
    assert.false(buttonWasClicked);

    await click('button');

    assert.true(buttonWasClicked);
  });

  test('it renders @theme', async function (assert) {
    assert.expect(1);

    this.set('theme', 'secondary');

    await render(hbs`
      <Button
        @theme={{this.theme}}
      />
    `);

    const button = this.element.querySelector('button');

    assert.ok(button.classList.contains('secondary'));
  });

  test('it renders @icon', async function (assert) {
    assert.expect(2);

    this.set('icon', 'chevron-right');

    await render(hbs`
      <Button
        @icon={{this.icon}}
      />
    `);

    const button = this.element.querySelector('button');
    const svg = this.element.querySelector('button svg');

    assert.ok(button.classList.contains('chevron-right'));
    assert.notEqual(svg, undefined);
  });
});
