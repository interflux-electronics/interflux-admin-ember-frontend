import Button from '../component';
import { PropTypes } from 'ember-prop-types';

const { string } = PropTypes;

export default Button.extend({
  tagName: 'a',
  classNames: ['button-to-url'],
  attributeBindings: ['href', 'target', 'rel'],

  propTypes: {
    href: string.isRequired,
    text: string,
    icon: string
  },

  // Always open external URLs in new browser tabs
  target: '_blank',

  // For security, always add this to external links
  // https://developers.google.com/web/tools/lighthouse/audits/noopener
  rel: 'noopener'
});
