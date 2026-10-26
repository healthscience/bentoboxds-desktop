# bentoboxds

BentoBoxDS - Gaia Intelligences Shape Health

The peer experience on the fly to attune health by practicing biopoiesis. ( https://bentoboxds.org/ ) Lives on the peer to peer network HOP Health Oracle Protocol ( https://github.com/healthscience/hop )


## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install --allow-git=all

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

A HOP instance will be started but that hop folder needs to be at same level of directory as bentoboxds. NB. Also some tests assume data setup in HOP.

To start HOP manually with the test storage used in development:
```sh
cd ../hop
npm run start -- test-hop-storage

```

To run unit tests:
```sh
npm run test:unit
```


### Run End-to-End Tests with [Cypress](https://www.cypress.io/)  also component testing (note turn off BasicSsl() in vite.config.js)


### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
