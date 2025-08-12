# bentoboxds

BentoBoxDS - sovereign intelligences shape health
A graphical toolkit building collective intelligences ( https://bentoboxds.org/ ) includig charting & building network experiments & coordinating DML (decentralise machine learning) on the Health Oracle Protocol ( https://github.com/healthscience/hop )

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

A HOP instance will be start but that hop folder needs to be at same level of directory as bentoboxds. NB. Also some test assume data setup in HOP.

```sh
npm run test:headless   or npm run test:browser
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)  also component testing (note turn off BasicSsl() in vite.config.js)


### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
