import ENV from 'interflux/config/environment';

export function initialize() {
  console.debug('DEBUG: Git revision :', ENV.gitRevision);
  console.debug('DEBUG: Git branch   :', ENV.gitBranch);
}

export default {
  initialize
};
