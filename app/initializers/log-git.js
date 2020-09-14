import ENV from 'interflux/config/environment';

export function initialize(/* application */) {
  console.debug('DEBUG: Git revision :', ENV.gitRevision);
  console.debug('DEBUG: Git branch   :', ENV.gitBranch);
  console.debug('DEBUG: -------------------------------');
}

export default {
  initialize
};
