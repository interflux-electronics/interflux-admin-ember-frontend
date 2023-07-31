import Component from '@glimmer/component';
import { service } from '@ember/service';

// <FileUploader
//   @record={{this.document}}
//   @cdnFiles={{this.document.files}}
//   @multilingual={{true}}
//   @accept='.pdf'
// />

export default class FileUploaderComponent extends Component {
  // @args record
  // @args cdnFiles
  // @args multilingual
  // @args accept

  @service translation;

  get rows() {
    const { record, cdnFiles, multilingual } = this.args;

    if (!record) {
      console.warn('no @record passed into <FileUploader>');
      return [];
    }

    if (multilingual) {
      const arr = [];
      this.translation.languages.map((language) => {
        const cdnFilesForLanguage = cdnFiles.filter(
          (f) => f.locale === language.locale
        );
        if (cdnFilesForLanguage.length > 0) {
          cdnFilesForLanguage.forEach((cdnFile) => {
            arr.push({ cdnFile, language });
          });
        } else {
          arr.push({ language });
        }
      });
      cdnFiles
        .filter((f) => !f.locale)
        .forEach((cdnFile) => {
          arr.push({ cdnFile });
        });

      return arr;
    }

    return cdnFiles.map((cdnFile) => {
      cdnFile;
    });
  }
}
