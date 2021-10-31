import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

// Inspired from:
// https://stackoverflow.com/questions/23199459/replace-all-content-between-characters-with-javascript

// Don't use triple curlies:
// https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-triple-curlies.md

const convertList = (str) => {
  // 1. Split string on "* "
  // 2. Remove all blank strings
  // 3. Remove all line breaks
  const items = str
    .split(/^\*\s|\n\*\s/g)
    .filter((x) => !!x)
    .map((x) => x.replace(/\n/g, ''));

  // Build the HTML
  let html = '<ul>';
  items.forEach((item) => {
    html += `<li>${convertInlineElements(item)}</li>`;
  });
  html += '</ul>';

  return html;
};

const convertBlockquote = (str) => {
  const words = str.substring(2).split(' ');
  const spans = `<span class="word">${words.join(
    '</span><span class="space">&#32;</span><span class="word">'
  )}</span>`;
  return `<blockquote><p>${spans}</p></blockquote>`;
};

const convertInlineElements = (str) => {
  // Replace single line breaks with <br>
  let html = str.replace(/\n/g, '<br>');

  // Wrap ***marked*** words with <mark>
  html = html.replace(/\*{3}([^*]+)\*{3}/g, '<mark>$1</mark>');

  // Wrap **bolded** words with <strong>
  html = html.replace(/\*{2}([^*]+)\*{2}/g, '<strong>$1</strong>');

  // Wrap *italic* words with <i>
  html = html.replace(/\*{1}([^*]+)\*{1}/g, '<em>$1</em>');

  // Wrap [hyperlinks](https://wikipedia.com) with <a>
  const links = html.match(/\[.*?\)/g);
  if (links != null && links.length > 0) {
    links.forEach((hyper) => {
      const text = hyper.match(/\[(.*?)\]/)[1];
      const url = hyper.match(/\((.*?)\)/)[1];

      const result = url.startsWith('http')
        ? `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
        : `<a href="${url}">${text}</a>`;

      html = html.replace(hyper, result);
    });
  }

  return html;
};

export default helper(function markdown(params) {
  const string = params[0];

  // { noParagraphs: true }
  const options = params[1] || {};

  if (!string) {
    return string;
  }

  let html = '';

  // 1. First replace the legacy \r and Window's \r\n with simply \n
  // 2. Replace all occurances of 3 or more \n with \n\n
  // 3. Split the string whereever there are \n\n
  const blocks = string
    .replace(/\r\n|\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .split(/\n\n/g);

  blocks.forEach((block) => {
    let b = block.trim();

    if (b.startsWith('# ')) {
      html += `<h1>${b.substring(2)}</h1>`;
    } else if (b.startsWith('## ')) {
      html += `<h2>${b.substring(3)}</h2>`;
    } else if (b.startsWith('### ')) {
      html += `<h3>${b.substring(4)}</h3>`;
    } else if (b.startsWith('#### ')) {
      html += `<h4>${b.substring(5)}</h4>`;
    } else if (b.startsWith('##### ')) {
      html += `<h5>${b.substring(6)}</h5>`;
    } else if (b.startsWith('###### ')) {
      html += `<h6>${b.substring(7)}</h6>`;
    } else if (b.startsWith('* ')) {
      html += convertList(b);
    } else if (b.startsWith('> ')) {
      html += convertBlockquote(b);
    } else if (options.noParagraphs) {
      html += `${convertInlineElements(b)}`;
    } else {
      html += `<p>${convertInlineElements(b)}</p>`;
    }
  });

  html = html.replace(/™/g, '<sup>&trade;</sup>');
  html = html.replace(/®/g, '<sup>&reg;</sup>');

  return htmlSafe(html);
});
