import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | responsive-video', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(3);

    this.set('video', {
      path: 'videos/test/foo',
      variations: '@1920x1080.mp4,@1920x1080.webm'
    });

    await render(hbs`<ResponsiveVideo @video={{this.video}} />`);

    const svg = this.element.querySelector('svg');

    assert.equal(svg.getAttribute('viewBox'), '0 0 16 9');
    assert.ok(this.element.querySelector('source[type="video/webm"]'));
    assert.ok(this.element.querySelector('source[type="video/mp4"]'));
  });
});
