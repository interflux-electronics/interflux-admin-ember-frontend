import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

// Working with the QR code:
// https://github.com/zxpsuper/qrcode-with-logos/tree/master

export default class WebinarController extends Controller {
  @tracked QR;

  get permalink() {
    return this.model.permalink;
  }

  @action
  async render(image) {
    this.QR = await new QrCodeWithLogo({
      image,
      width: 2000,
      content: this.permalink.redirectFrom,
      logo: {
        src: 'https://cdn.interflux.com/images/logos/secondary-interflux-electronics-symbol-2.svg',
        logoSize: 0.22,
        borderRadius: 0
      },
      nodeQrCodeOptions: {
        margin: 3,
        errorCorrectionLevel: 'Q', // L M Q H
        color: {
          dark: '#163759',
          light: '#ffffff'
        }
      }
    });

    this.QR.toImage();
  }

  @action
  download() {
    this.QR.downloadImage();
  }
}
