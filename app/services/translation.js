import Service from '@ember/service';

export default class TranslationService extends Service {
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
      locale: 'fr',
      nameEnglish: 'French',
      country: {
        id: 'FR',
        nameEnglish: 'France'
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
    }
  ];
}
