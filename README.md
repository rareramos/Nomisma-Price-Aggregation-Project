[![CircleCI](https://circleci.com/gh/NomismaTech/price-aggregation.svg?style=svg&circle-token=05fe04679cc4b3aa4365ef2342af86262f6332c5)](https://circleci.com/gh/NomismaTech/price-aggregation)

# price-aggregator

> Price Aggregator for Loans, Derivatives, CFD

## Table of Contents

- [price-aggregator](#price-aggregator)
  - [Project Structure](#project-structure)
  - [First time Setup](#first-time-setup)
    - [Running Loans Pipeline](#running-loans-pipeline)
    - [Running CFD Pipeline](#running-cfd-pipeline)

---

### Project Structure

price-aggregator consists of following sub-repos:

| Folder     | Description                                                                               |
| ---------- | :---------------------------------------------------------------------------------------- |
| `client`   | Front-end application based on React.js / Redux                                           |
| `db`       | Database Adapter and Models for MongoDB                                                   |
| `fetcher`  | Data pipelines based on Node.js to fetch loans / cfd data from 3rd-party platforms        |
| `pubsub`   | Publisher-Subscriber Node.js server acting as a middleware between `fetcher` and `client` |
| `scraping` | Data extraction crawlers written in Python for fetching data from 3rd-party platforms     |

### First time Setup

1. Install Node.js, NPM, Yarn!, Python 3, VirtualEnv, Pip
2. Obtain secret `npm` token from [tushar00jain](https://github.com/tushar00jain)
3. Create `.npmrc` file in your home directory: `~/.npmrc`:

```
//registry.npmjs.org/:_authToken=<your-access-token>
```

4. Go to project root: `$ cd price-aggregator`
5. Install all dependencies `$ yarn install:all`

#### Running Loans Pipeline

##### Server

```
$ cd server             // go to server folder
$ yarn start            // run it locally
$ yarn build            // this will build the server code to es5 js codes and generate a dist file
```

##### Client

```
$ yarn start            // runs files in docs by serving on an http server

// local build
$ yarn dev              // run it locally

// production build
$ yarn build            // compiles react code and generates a folder `docs` on the root level
```

##### Run Fetcher

```
$ cd fetcher
$ yarn && yarn simple-pipeline
```

#### Running CFD Pipeline

##### Fetcher

```
$ cd fetcher           // go to fetcher folder
$ yarn cfd-pipeline    // run it locally
```

##### Pub-sub

```
$ cd pubsub            // go to pubsub folder
$ yarn start           // start Node.js server
```

##### Server

```
$ cd server            // go to server folder
$ yarn start           // run API server locally
$ yarn build           // this will build the server code to es5 js codes and generate a dist file
```

##### Client

```
$ yarn start  // runs files in docs by serving on an http server

// local build
$ yarn dev    // run it locally

// production build
$ yarn build  // compiles react code and generates a folder `docs` on the root level
```
