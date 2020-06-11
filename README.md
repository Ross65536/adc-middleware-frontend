# Frontend for ADC middleware server

A very simple and basic frontend for the [ADC middleware server](https://github.com/Ross65536/adc-middleware), meant only for the demonstration of the middleware's access control capabilities.

## Instructions

### Setup

1. Install deps

```bash
yarn install
```

2. Setup keycloak

Start keycloak and then create a new client in the `Clients` tab: load (import) and save the client from the file `config/front-end.json`. Go to `Installation` tab in the client and download the `Keycloak OIDC JSON` format and place in `public/keycloak.json`, you will need to replace the value's `auth-server-url` host with with the front-ends's server value (e.g. cahnge to `http://localhost:3000/auth/`).


> If you run the middleware server or keycloak server in unexpected ports you need to update `.env`

3. Disable CORS in browser

For firefox you can use [this extension](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/)

### Development

- Run locally:

  yarn start

- Build:

  yarn build

