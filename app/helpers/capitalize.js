import { helper } from '@ember/component/helper';
import { capitalize as cap } from '@ember/string';

export default helper(function capitalize(params /*, hash*/) {
  const str = params[0];
  return str ? cap(str) : str;
});
