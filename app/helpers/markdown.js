import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';

// Inspired from:
// https://stackoverflow.com/questions/23199459/replace-all-content-between-characters-with-javascript

// Don't use triple curlies:
// https://github.com/ember-template-lint/ember-template-lint/blob/master/docs/rule/no-triple-curlies.md

export default helper(function markdown(params) {
  const text = params[0];
  if (!text) {
    return text;
  }
  // Wrap all **bolded** words with <strong> tags
  let html = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  return htmlSafe(html);
});
