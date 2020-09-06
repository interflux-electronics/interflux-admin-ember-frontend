import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | button', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders <a> to a route', async function (assert) {
    assert.expect(3);

    this.set('text', 'Click me');
    this.set('route', 'index');

    await render(hbs`
      <Button
        @route={{this.route}}
        @text={{this.text}}
      />`);

    const a = this.element.querySelector('a');

    assert.notEqual(a, undefined);
    assert.equal(a.textContent.trim(), this.text);
    assert.equal(a.target, '');
  });

  test('it renders <a> to an external URL', async function (assert) {
    assert.expect(4);

    this.set('text', 'Click me');
    this.set('url', 'https://interflux.com/');

    await render(hbs`
      <Button
        @url={{this.url}}
        @text={{this.text}}
      />`);

    const a = this.element.querySelector('a');

    assert.notEqual(a, undefined);
    assert.equal(a.textContent.trim(), this.text);
    assert.equal(a.href, this.url);
    assert.equal(a.target, '_blank');
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
      />`);

    const button = this.element.querySelector('button');

    assert.notEqual(button, undefined);
    assert.equal(button.textContent.trim(), this.text);
    assert.equal(buttonWasClicked, false);

    await click('button');

    assert.equal(buttonWasClicked, true);
  });
});
