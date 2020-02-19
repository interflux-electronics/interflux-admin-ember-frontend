import Button from '../component';
import { PropTypes } from 'ember-prop-types';

const { func, string } = PropTypes;

export default Button.extend({
  classNames: ['button-action'],

  propTypes: {
    onClick: func.isRequired,
    text: string,
    icon: string
  },

  // Perform the action passed in
  click(event) {
    this.onClick(event);
  }
});
