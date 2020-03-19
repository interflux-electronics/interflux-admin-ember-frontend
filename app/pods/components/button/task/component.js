import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ButtonTaskComponent extends Component {
  @action
  perform() {
    this.args.task.perform();
  }
}

//
// import Button from '../component';
// import { get } from '@ember/object';
// import { readOnly, notEmpty } from '@ember/object/computed';
// // import { PropTypes } from 'ember-prop-types';
//
// // const { func, string } = PropTypes;
//
// export default Button.extend({
//   // propTypes: {
//   //   task: func.isRequired,
//   //   text: string,
//   //   icon: string
//   // },
//
//   classNames: ['button-task'],
//   classNameBindings: [
//     'isRunning:busy:idle',
//     'showError:show-error:no-errors',
//     'style'
//   ],
//   attributeBindings: ['tabindex', 'disabled'],
//   tabindex: 1,
//   disabled: false,
//
//   // Show loading state
//   isRunning: readOnly('task.isRunning'),
//
//   // Show task error
//   showError: notEmpty('error'),
//   error: readOnly('errors.firstObject'),
//   errors: null,
//
//   // Perform the task passed in
//   click() {
//     get(this, 'onClick')();
//   }
// });
