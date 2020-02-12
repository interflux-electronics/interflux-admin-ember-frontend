import { helper } from '@ember/component/helper';
import ENV from 'interflux/config/environment';

export default helper(function env(params) {
  return ENV[params];
});
