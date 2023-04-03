import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class NavResourcesComponent extends Component {
  @service auth;
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
        icon: 'svg/prescription-bottle',
        needs: ['read_products', 'read_product_families']
      },
      {
        label: 'Families',
        route: 'secure.families',
        icon: 'svg/flask',
        needs: ['read_product_families']
      },
      {
        label: 'Qualities',
        route: 'secure.qualities',
        icon: 'svg/medal',
        needs: ['read_qualities']
      },
      {
        label: 'Processes',
        route: 'secure.uses',
        icon: 'svg/microchip',
        needs: ['read_uses']
      },
      {
        label: 'Documents',
        route: 'secure.documents',
        icon: 'svg/document',
        needs: ['read_documents']
      },
      {
        label: 'Companies',
        route: 'secure.companies',
        icon: 'svg/building',
        needs: ['read_companies']
      },
      {
        label: 'People',
        route: 'secure.people',
        icon: 'svg/street-view',
        needs: ['read_people']
      },
      {
        label: 'Images',
        route: 'secure.images',
        icon: 'svg/camera',
        needs: ['read_images']
      },
      {
        label: 'Videos',
        route: 'secure.videos',
        icon: 'svg/film',
        needs: ['read_videos']
      },
      {
        label: 'Translations',
        route: 'secure.translations',
        icon: 'svg/translate',
        needs: ['read_translations']
      },
      {
        label: 'Webinars',
        route: 'secure.webinars',
        icon: 'svg/podcast',
        needs: ['read_webinars']
      },
      {
        label: 'Events',
        route: 'secure.events',
        icon: 'svg/calendar',
        needs: ['read_events']
      },
      {
        label: 'Countries',
        route: 'secure.countries',
        icon: 'svg/flag',
        needs: ['read_countries']
      }
      // {
      //   label: 'Sessions',
      //   route: 'secure.sessions',
      //   icon: 'svg/eye'
      // }
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

  get resourcesForUser() {
    return this.resources.filter((resource) => {
      return resource.needs.every((ability) => {
        return this.auth.user.can(ability);
      });
    });
  }
}
