import InputComponent from '../input/component';
import { action } from '@ember/object';

export default class TextareaComponent extends InputComponent {
  // See <Input> component

  // The contenteditable <p>
  textarea;

  // On insert, add the @value to the p.contenteditable.
  @action
  onInsert(element) {
    this.textarea = element;
    this.textarea.innerText = this.args.value;
    this.resize();
  }

  // Prevent HTML formatting from being pasted into the p.contenteditable.
  @action
  onPaste(event) {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
  }

  // Unlike <Input> we don't select the text on focus.
  @action
  selectText() {
    // Do nothing.
  }

  @action
  onKeyUp(event) {
    if (this.args.onKeyUp) {
      this.args.onKeyUp(event);
    }

    this.resize();
  }

  @action
  resize() {
    const height = this.textarea.getBoundingClientRect().height;
    console.log('keydown', height);
    this.textarea.parentElement.parentElement.style = `height: ${height}px;`;
  }
}
