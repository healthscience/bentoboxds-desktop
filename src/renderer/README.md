# bentoboxds

BentoBoxDS - sovereign intelligences that shapes health
A graphical toolkit for charting ( https://bentoboxds.org/ ) & building network experiments & coordinating DML (decentralise machine learning) on the Health Oracle Protocol ( https://github.com/healthscience/hop )

BentoBoxDS run as desktop or web application in the browser and will require HOP to be installed locally.  Setup help available discord server (community link on  https://bentoboxds.org/).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
