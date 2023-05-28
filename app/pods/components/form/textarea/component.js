import InputComponent from '../input/component';
import { htmlSafe } from '@ember/template';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

// NOTE: this component inherits most logic from <Form::Input>

export default class TextareaComponent extends InputComponent {
  // HACK: Because we use the Ember component <Textarea> the value passed in has to be the start value, not a value which can update over time.
  @tracked startValue = 'abc';

  constructor() {
    super(...arguments);

    this.startValue = this.value;
  }

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

  // HACK: the text within the <textarea> does not update if the @value changes.
  // To resolve we use a mutation observer to update the value manually.
  @action
  onInsert(pusher) {
    const textarea = pusher.nextElementSibling;

    const observer = new MutationObserver(() => {
      textarea.value = this.args.value;
    });

    const config = {
      childList: true
    };

    observer.observe(pusher, config);
  }
}
