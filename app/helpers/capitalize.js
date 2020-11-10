import { helper } from '@ember/component/helper';
import { capitalize as cap } from '@ember/string';

export default helper(function capitalize(params /*, hash*/) {
  return cap(params[0]);
});
