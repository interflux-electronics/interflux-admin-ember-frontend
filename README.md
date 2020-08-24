# Interflux Admin

This Ember front-end is the UI where Interflux team members log in to make changes to resources in their database and website.

## Prerequisites

* [Git](https://git-scm.com/)
* [NVM](https://github.com/nvm-sh/nvm)
* [Yarn](https://yarnpkg.com/)

## Installation

* `git clone <repository-url>` this repository
* `cd admin.interflux.com`
* `nvm install`
* `yarn install`

## Serving

* `yarn serve`

## Building

* `yarn build`

## Deploying

* `yarn deploy`

## Branches

We have two branches: `master` and `production`. Developers branch of and merge back into `master` and never need access to `production`. The `production` branch is a representation of what is currently live on our servers and only needs to be checked out for recreating bugs found in production, but not in master.
