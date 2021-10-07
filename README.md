# Basic User Analytics Dashboard

## Overview

This sample project provides a dashboard to view usage statistics of client webpages which have installed a custom JavaScript tracker, much like the Facebook Pixel.

It is built using Typescript, TypeORM, GraphQL, and React.

## Project Structure

```
src/
|_ app/            (1)
  |_ public/         
|_ api/            (2)
  |_resolvers/       
|_ models/         (3)
```

The project is split into two servers:

1. The frontend server: This serves the dashboard which allows users to see usage statistics (traffic, events) captured from any number of clients' websites. This server also hosts the vanilla JavaScript tracker code, which would be embedded in client websites using a JavaScript `<script>` tag.

2. The backend API: This API processes all incoming tracking events from JavaScript trackers all across the web. This API has a direct connection to a data store which stores all usage statistics and analytics then surfaced to the dashboard via its GraphQL endpoint.

Both the frontend server and backend API share models (3) between them. 

*Why split the logic into two servers instead of hosting the processing endpoint and dashboard-serving endpoint from the same server?*

This design decision was intentionally made so that in deployment the FE app and BE API can be scaled as needed independently. Where it may make sense to scale the data processing API vertically to give its instances more resources, it may make more sense to scale the FE server horizontally, because though serving pages isn't resource-intensive the instances could be overwhelmed by a surge of traffic.

## How to Run

##### Install Dependencies

Install the necessary dependencies by running. 

```
npm install
```

*Note:* This project was developed using `node v.15.1.0` and `npm 7.0.8`, though earlier and later versions may work.

##### Configure the Project Environment

Copy the included local environment into an environment file.

```
cp .local-env .env
```

Edit the `.env` file to reflect your local environment. 

*Note:* This project requires a running PostgreSQL database that it can connect to via  URL, which should include credentials.

##### Start the Servers

Start the API server.

```
npm run start:api
```

Start the frontend server.

```
npm run start:app
```

Navigate to `localhost:8090` and, if you've started this project correctly, you should see the dashboard homepage!