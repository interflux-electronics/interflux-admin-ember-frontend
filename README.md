# Interflux Admin

This Ember front-end is the UI where Interflux team members log in to make changes to resources in their database and website.

## Prerequisites

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- [PNPM](https://pnpm.io/)
- [Ember CLI](https://cli.emberjs.com/release/)
- [Google Chrome](https://google.com/chrome/)

## Installation

- `git clone <repository-url>` this repository
- `cd admin.interflux.com`
- `nvm install`
- `pnpm install`

## Serving

- `pnpm lint`
- `pnpm lint:fix`

## Building

- `pnpm build`

## Development

- `pnpm start`

## Further Reading / Useful Links

- [ember.js](https://emberjs.com/)
- [ember-cli](https://cli.emberjs.com/release/)
- Development Browser Extensions
  - [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  - [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

## Branches

We have two branches: `master` and `production`. Developers branch of and merge back into `master` and never need access to `production`. The `production` branch is a representation of what is currently live on our servers and only needs to be checked out for recreating bugs found in production, but not in master.
