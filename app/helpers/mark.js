import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

export default helper(function markdown(params) {
  const phrase = params[1];

  if (!phrase) {
    return '';
  }

  const wordToMark = params[0];

  if (!wordToMark) {
    return phrase;
  }

  let html = phrase;

  const regex = new RegExp(wordToMark, 'gi');

  html = html.replace(regex, '<mark>$&</mark>');

  return htmlSafe(html);
});
