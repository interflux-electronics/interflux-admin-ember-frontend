import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class NavResourcesComponent extends Component {
  @service router;

  @tracked expanded = true;

  get isExpanded() {
    return this.expanded ? 'expanded' : 'collapsed';
  }

  @action
  toggleExpansion() {
    this.expanded = !this.expanded;
  }

  @action
  collapse() {
    this.expanded = false;
  }

  get currentRoute() {
    return this.router.currentRoute ? this.router.currentRoute.name : '-';
  }

  get resources() {
    const arr = [
      {
        label: 'Products',
        route: 'secure.products',
        icon: 'svg/prescription-bottle'
      },
      {
        label: 'Families',
        route: 'secure.families',
        icon: 'svg/flask'
      },
      {
        label: 'Qualities',
        route: 'secure.qualities',
        icon: 'svg/medal'
      },
      {
        label: 'Processes',
        route: 'secure.uses',
        icon: 'svg/microchip'
      },
      {
        label: 'Documents',
        route: 'secure.documents',
        icon: 'svg/document'
      },
      {
        label: 'Companies',
        route: 'secure.companies',
        icon: 'svg/building'
      },
      {
        label: 'People',
        route: 'secure.people',
        icon: 'svg/street-view'
      },
      {
        label: 'Images',
        route: 'secure.images',
        icon: 'svg/camera'
      },
      {
        label: 'Videos',
        route: 'secure.videos',
        icon: 'svg/film'
      },
      {
        label: 'Webinars',
        route: 'secure.webinars',
        icon: 'svg/podcast'
      },
      {
        label: 'Countries',
        route: 'secure.countries',
        icon: 'svg/flag'
      }

      // {
      //   label: 'Orders',
      //   route: 'secure.orders',
      //   icon: 'svg/truck'
      // },
      // {
      //   label: 'Leads',
      //   route: 'secure.leads',
      //   icon: 'svg/seedling'
      // }
    ];

    // Evaluate per resource whether its route is active
    arr.forEach((resource) => {
      resource.isActive = this.currentRoute.startsWith(resource.route)
        ? 'active'
        : 'idle';
    });

    return arr;
  }
}
