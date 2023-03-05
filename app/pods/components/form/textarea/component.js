import InputComponent from '../input/component';
import { htmlSafe } from '@ember/template';
import { action } from '@ember/object';

// NOTE: this component inherits most logic from <Form::Input>

export default class TextareaComponent extends InputComponent {
  get value() {
    return this.args.value || ''; // Prevent showing user "undefined"
  }

  // Text areas include \n line breaks when users enter. When you show this
  // in <p> they do not break the line. Therefor we need to replace
  // all \n with <br> so that the <textarea> will expand vertically on input.
  get valueWithBreaks() {
    const html = this.value.replace(/(?:\r\n|\r|\n)/g, '<br>');

    return htmlSafe(html);
  }

  // Prevent HTML formatting from being pasted into the p.contenteditable.
  @action
  onPaste(event) {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
  }

  // Unlike <Form::Input> we don't select the text on focus.
  @action
  selectText() {
    document.execCommand('selectAll', false, null);
  }

  @action
  onKeyUp(event) {
    if (this.args.onKeyUp) {
      this.args.onKeyUp(event);
    }
  }

  get contenteditable() {
    return this.args.disabled ? false : true;
  }
}
