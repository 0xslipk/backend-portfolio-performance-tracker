# Portfolio Performance Tracker

This project provides an API for users to input portfolio parameters, track the performance of their portfolios relative to another cryptocurrency (e.g., BTC or ETH), and display this information to a front-end application.

## Environment setup

 - Install [Node.js](https://nodejs.org/)
   - Recommended method is by using [NVM](https://github.com/creationix/nvm)
   - Recommended Node.js version is v18.x
 - Install [Docker](https://docs.docker.com/get-docker/)

## Get Started

Install all the dependencies:

```
npm ci
```

Copy the `.env.sample` file to `.env`

```
cp .env.sample .env
```

In the project directory, you can run:

### `npm run start:dockers`

Runs the NodeJs and Postgres services in the development mode.\
Open [localhost:8084/api/v1](http://0.0.0.0:8080/api/v1) to view it in the browser or Postman.

The service will reload if you make edits.

### `npm run down:dockers`

Stops and remove containers, networks, volumes, and images created by `npm start:dockers`

### `npm logs`

Displays log output from all services.

### `npm run backend:rebuild`

Removes `backend` container and build it again

### `npm run backend:restart`

Restarts `backend` service.

### `npm run backend:logs`

Displays log output from `backend` service.

## Test

### `npm run test`

Running the unit tests.

### `npm run test:cov`

Running the test coverage.

## API Definition

Open [localhost:8084/api/v1](http://0.0.0.0:8080/api/v1) and navigate to Schema tab.

## Users Access tokens

| username | access_token |
| -------- | ------------ |
| user1 | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJ1c2VybmFtZSI6InVzZXIxIiwiaWF0IjoxNjk5Mzc0MzMwLCJleHAiOjE3MDcxNTAzMzB9.sKm9xhUqGQkxKaTfhgQsLpwnszWztELuxxl_mJ9uBNo |
| user2 | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIiLCJ1c2VybmFtZSI6InVzZXIyIiwiaWF0IjoxNjk5Mjg3NDc1LCJleHAiOjE3MDcwNjM0NzV9.98NW8eYARxY83ModBzhYSuq7NTZSicpiYEZD6yxkVTQ |
| user3 | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMiLCJ1c2VybmFtZSI6InVzZXIzIiwiaWF0IjoxNjk5Mjg3NDkxLCJleHAiOjE3MDcwNjM0OTF9.pNdvCtmhUwO8Lbz_zKpxlRKuoQXL_zmVT-_yWIb4wdc |
| user4 | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQiLCJ1c2VybmFtZSI6InVzZXI0IiwiaWF0IjoxNjk5Mjg3NTA1LCJleHAiOjE3MDcwNjM1MDV9.k7DGfxh-kfwBtbjn_IieNi3QIUK3m9bbmqfg-13ajKY |
| user5 | eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUiLCJ1c2VybmFtZSI6InVzZXI1IiwiaWF0IjoxNjk5Mjg3NTE2LCJleHAiOjE3MDcwNjM1MTZ9.gvq5CgjZYYUAcSoGPssrtdVfcAKoxxLItvgvVAb2ReU |
