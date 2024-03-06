import BaseRoute from 'interflux/pods/base/route';
import { hash } from 'rsvp';

export default class VisitorsWhoRoute extends BaseRoute {
  beforeModel() {
    this.store.createRecord('visitor-summary', {
      host: 'interflux.com',
      year: '2024',
      data: {
        customers: {
          perMonth: [
            { month: 1, total: 200, ratio: 0.2 },
            { month: 2, total: 200, ratio: 0.2 },
            { month: 3, total: 30, ratio: 0.2 },
            { month: 4, total: 100, ratio: 0.2 },
            { month: 5, total: 12, ratio: 0.2 },
            { month: 6, total: 0, ratio: 0.2 },
            { month: 7, total: 200, ratio: 0.2 },
            { month: 8, total: 789, ratio: 0.1 },
            { month: 9, total: 200, ratio: 0.2 },
            { month: 10, total: 200, ratio: 0.2 },
            { month: 11, total: 200, ratio: 0.2 },
            { month: 12, total: 100, ratio: 0.1 }
          ],
          perCountry: [
            {
              country: { id: 'BE', nameEnglish: 'Belgium' },
              label: 'Belgium',
              total: 3200,
              ratio: 0.5
            },
            {
              country: { id: 'US', nameEnglish: 'USA' },
              label: 'United States of America',
              total: 500,
              ratio: 0.2
            },
            {
              country: { id: 'AU', nameEnglish: 'Australia' },
              label: 'Australia',
              total: 200,
              ratio: 0.1
            }
          ]
        },
        interflux: {
          perMonth: [
            { month: 1, total: 0, ratio: 0.2 },
            { month: 2, total: 20, ratio: 0.2 },
            { month: 3, total: 30, ratio: 0.2 },
            { month: 4, total: 50, ratio: 0.2 },
            { month: 5, total: 12, ratio: 0.2 },
            { month: 6, total: 0, ratio: 0.2 },
            { month: 7, total: 10, ratio: 0.2 },
            { month: 8, total: 0, ratio: 0.1 },
            { month: 9, total: 0, ratio: 0.2 },
            { month: 10, total: 88, ratio: 0.2 },
            { month: 11, total: 3, ratio: 0.2 },
            { month: 12, total: 15, ratio: 0.1 }
          ],
          perCompany: [
            {
              country: { id: 'BE', nameEnglish: 'Belgium' },
              label: 'Interflux Belgium',
              total: 3200,
              ratio: 0.5
            },
            {
              country: { id: 'SG', nameEnglish: 'Singapore' },
              label: 'Interflux Singapore',
              total: 500,
              ratio: 0.2
            },
            {
              country: { id: 'AU', nameEnglish: 'Australia' },
              label: 'Interflux Australia',
              total: 200,
              ratio: 0.1
            }
          ]
        },
        robots: {
          perMonth: [
            { month: 1, total: 0, ratio: 0.2 },
            { month: 2, total: 20, ratio: 0.2 },
            { month: 3, total: 30, ratio: 0.2 },
            { month: 4, total: 50, ratio: 0.2 },
            { month: 5, total: 12, ratio: 0.2 },
            { month: 6, total: 0, ratio: 0.2 },
            { month: 7, total: 10, ratio: 0.2 },
            { month: 8, total: 0, ratio: 0.1 },
            { month: 9, total: 0, ratio: 0.2 },
            { month: 10, total: 88, ratio: 0.2 },
            { month: 11, total: 3, ratio: 0.2 },
            { month: 12, total: 15, ratio: 0.1 }
          ],
          perSource: [
            {
              country: { id: 'US', nameEnglish: 'USA' },
              label: 'Google',
              total: 3200,
              ratio: 0.5
            },
            {
              country: { id: 'CN', nameEnglish: 'China' },
              label: 'Petal Bot',
              total: 500,
              ratio: 0.2
            },
            {
              country: { id: 'RU', nameEnglish: 'Russia' },
              label: 'malicious bot',
              total: 200,
              ratio: 0.1
            }
          ]
        }
      }
    });

    // this.store.createRecord('visitor-summary', {
    //   host: 'interflux.com',
    //   year: '2024',
    //   customersPerMonth: '0,0,0,120,408,622,0,0,0,0,0,0',
    //   interfluxPerMonth: '0,0,0,120,408,622,0,0,0,0,0,0',
    //   robotsPerMonth: '0,0,0,120,408,622,0,0,0,0,0,0',
    //   customersPerCountry: '[[BE,3200,0.5],[DE,829,0.3][US,402]]',
    //   interfluxPerCompany: '[[IFBE,3200],[IFSG,829][IFAU,402]]',
    //   robotsPerSource:
    //     '[["Google",3200,0.6,"good"],["Interflux bot",402,0.2,"good"]'
    // });
  }

  model() {
    return hash({
      visitorSummaries: this.store.peekAll('visitor-summary')
    });
  }
}
