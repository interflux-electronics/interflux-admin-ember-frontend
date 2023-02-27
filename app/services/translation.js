import Service from '@ember/service';
import { service } from '@ember/service';

export default class TranslationService extends Service {
  @service api;

  async translate(record) {
    return new Promise((resolve, reject) => {
      console.debug('translating', record.status, record.location);

      fetch(`${this.api.url}/translate`, {
        method: 'POST',
        headers: this.api.headers,
        body: JSON.stringify({
          phrase: record.english,
          source_lang: 'EN',
          target_lang: record.language.toUpperCase()
        })
      })
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        })
        .catch((response) => {
          reject(response);
        });
    });
  }

  languages = [
    {
      locale: 'en',
      nameEnglish: 'English',
      country: {
        id: 'GB',
        nameEnglish: 'United Kingdom'
      }
    },
    {
      locale: 'de',
      nameEnglish: 'German',
      country: {
        id: 'DE',
        nameEnglish: 'Germany'
      }
    },
    {
      locale: 'es',
      nameEnglish: 'Spanish',
      flag: 'ES',
      country: {
        id: 'ES',
        nameEnglish: 'Spain'
      }
    },
    {
      locale: 'fr',
      nameEnglish: 'French',
      country: {
        id: 'FR',
        nameEnglish: 'France'
      }
    },
    {
      locale: 'zh',
      nameEnglish: 'Chinese',
      country: {
        id: 'CN',
        nameEnglish: 'China'
      }
    },
    {
      locale: 'pl',
      nameEnglish: 'Polish',
      country: {
        id: 'PL',
        nameEnglish: 'Poland'
      }
    },
    {
      locale: 'tr',
      nameEnglish: 'Turkish',
      country: {
        id: 'TR',
        nameEnglish: 'Turkey'
      }
    },
    {
      locale: 'th',
      nameEnglish: 'Thai',
      country: {
        id: 'TH',
        nameEnglish: 'Thailand'
      }
    },
    {
      locale: 'ro',
      nameEnglish: 'Romanian',
      country: {
        id: 'RO',
        nameEnglish: 'Romania'
      }
    },
    {
      locale: 'id',
      nameEnglish: 'Indonesian',
      country: {
        id: 'ID',
        nameEnglish: 'Indonesia'
      }
    },
    {
      locale: 'pt',
      nameEnglish: 'Portugese',
      country: {
        id: 'PT',
        nameEnglish: 'Portugese'
      }
    },
    {
      locale: 'it',
      nameEnglish: 'Italian',
      country: {
        id: 'IT',
        nameEnglish: 'Itali'
      }
    },
    {
      locale: 'cs',
      nameEnglish: 'Czech',
      country: {
        id: 'CZ',
        nameEnglish: 'Czech'
      }
    }
  ];
}
