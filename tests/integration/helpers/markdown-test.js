import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

const twoParagraphsWithBreak = `
This is paragraph one.
This line is preceded by line break.

This is paragraph two.




This is paragraph three.
`;

const headings = `
# Heading 1

Foo.

## Heading 2

Foo.

### Heading 3

Foo.

#### Heading 4

Foo.

##### Heading 5

Foo.

###### Heading 6

Foo.
`;

const blockquote = `
This is a paragraph.

> Quote me!

This is a paragraph.
`;

const basicListMarkdown = `
* Apple
* Cherry
* Mango
`;

const basicListHTML = `
<ul>
  <li>Apple</li>
  <li>Cherry</li>
  <li>Mango</li>
</ul>
`;

const complexListMarkdown = `
These are *fruits*:

* Apple with *italic* text
* Cherry with *italic ending*
* Mango with **bold** text
* Banana with ***highlights***

... but not **all** of them.
`;

const complexListHTML = `
<p>These are <em>fruits</em>:</p>
<ul>
  <li>Apple with <em>italic</em> text</li>
  <li>Cherry with <em>italic ending</em></li>
  <li>Mango with <strong>bold</strong> text</li>
  <li>Banana with <mark>highlights</mark></li>
</ul>
<p>... but not <strong>all</strong> of them.</p>
`;

const flatten = (str) => {
  return str.replace(/\n/g, '').replace(/\s\s/g, '');
};

module('Integration | Helper | markdown', function (hooks) {
  setupRenderingTest(hooks);

  test('it converts one paragraph', async function (assert) {
    assert.expect(1);
    this.set('string', 'This is paragraph one.');
    await render(hbs`{{markdown string}}`);
    assert.equal(this.element.innerHTML, '<p>This is paragraph one.</p>');
  });

  test('it converts three paragraphs and single line breaks', async function (assert) {
    assert.expect(1);
    this.set('string', twoParagraphsWithBreak);
    await render(hbs`{{markdown string}}`);
    assert.equal(
      this.element.innerHTML,
      '<p>This is paragraph one.<br>This line is preceded by line break.</p><p>This is paragraph two.</p><p>This is paragraph three.</p>'
    );
  });

  test('it converts headings', async function (assert) {
    assert.expect(1);
    this.set('string', headings);
    await render(hbs`{{markdown string}}`);
    assert.equal(
      this.element.innerHTML,
      '<h1>Heading 1</h1><p>Foo.</p><h2>Heading 2</h2><p>Foo.</p><h3>Heading 3</h3><p>Foo.</p><h4>Heading 4</h4><p>Foo.</p><h5>Heading 5</h5><p>Foo.</p><h6>Heading 6</h6><p>Foo.</p>'
    );
  });

  test('it emphasises words', async function (assert) {
    assert.expect(1);
    this.set('string', 'This word is *italic*.');
    await render(hbs`{{markdown string}}`);
    assert.equal(
      this.element.innerHTML,
      '<p>This word is <em>italic</em>.</p>'
    );
  });

  test('it bolds words', async function (assert) {
    assert.expect(1);
    this.set('string', 'This word is **bolded**.');
    await render(hbs`{{markdown string}}`);
    assert.equal(
      this.element.innerHTML,
      '<p>This word is <strong>bolded</strong>.</p>'
    );
  });

  test('it marks words', async function (assert) {
    assert.expect(1);
    this.set('string', 'This word is ***highlighted***.');
    await render(hbs`{{markdown string}}`);
    assert.equal(
      this.element.innerHTML,
      '<p>This word is <mark>highlighted</mark>.</p>'
    );
  });

  test('it creates internal hyperlinks', async function (assert) {
    assert.expect(1);
    this.set('string', 'This word is a [hyperlink](/en/products).');
    await render(hbs`{{markdown string}}`);
    assert.equal(
      this.element.innerHTML,
      '<p>This word is a <a href="/en/products">hyperlink</a>.</p>'
    );
  });

  test('it creates external hyperlinks', async function (assert) {
    assert.expect(1);
    this.set('string', 'This word is a [hyperlink](https://wikipedia.com).');
    await render(hbs`{{markdown string}}`);
    assert.equal(
      this.element.innerHTML,
      '<p>This word is a <a href="https://wikipedia.com" target="_blank" rel="noopener noreferrer">hyperlink</a>.</p>'
    );
  });

  test('it converts blockquotes', async function (assert) {
    assert.expect(1);
    this.set('string', blockquote);
    await render(hbs`{{markdown string}}`);
    assert.equal(
      this.element.innerHTML,
      '<p>This is a paragraph.</p><blockquote><p><span class="word">Quote</span><span class="space"> </span><span class="word">me!</span></p></blockquote><p>This is a paragraph.</p>'
    );
  });

  test('it converts simple lists', async function (assert) {
    assert.expect(1);
    this.set('string', basicListMarkdown);
    await render(hbs`{{markdown string}}`);
    assert.equal(this.element.innerHTML, flatten(basicListHTML));
  });

  test('it converts complex lists', async function (assert) {
    assert.expect(1);
    this.set('string', complexListMarkdown);
    await render(hbs`{{markdown string}}`);
    assert.equal(this.element.innerHTML, flatten(complexListHTML));
  });
});
