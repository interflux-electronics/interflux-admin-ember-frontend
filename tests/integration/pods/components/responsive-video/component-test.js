import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import EmberObject from '@ember/object';

module('Integration | Component | responsive-video', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    assert.expect(4);

    this.video = EmberObject.create({
      path: 'videos/test/foo',
      variations:
        '@1920x1080.mp4,@1920x1080.webm,@1920x1080.png,@1920x1080.webp'
    });

    await render(
      hbs`<ResponsiveVideo @path={{this.video.path}} @variations={{this.video.variations}} @posters={{this.video.posters}} />`
    );

    const svg = this.element.querySelector('svg');
    const video = this.element.querySelector('video');

    assert.strictEqual(svg.getAttribute('viewBox'), '0 0 16 9');
    assert.strictEqual(
      video.getAttribute('poster'),
      'http://localhost:9000/videos/test/foo@1920x1080.webp'
    );
    assert.ok(this.element.querySelector('source[type="video/webm"]'));
    assert.ok(this.element.querySelector('source[type="video/mp4"]'));
  });
});
