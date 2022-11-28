import { helper } from '@ember/component/helper';

export function lowercase(params) {
  const phrase = params[0];

  if (!phrase) {
    console.warn('no phrase passed into {{lowercase ...}} helper');
    return '';
  }

  return params[0].toLowerCase();
}

export default helper(lowercase);
