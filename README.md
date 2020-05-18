# Frontend for ADC middleware server

## Instructions

### Setup

1. Install deps

```bash
yarn i
```

2. Setup keycloak

Start keycloak and then create a new client in the `Clients` tab: load (import) and save the client from the file `config/front-end.json`. Go to `Installation` tab in the client and download the `Keycloak OIDC JSON` format and place in `public/keycloak.json`.


> If you run the middleware server or keycloak server in unexpected ports you need to update `.env`

3. Disable CORS in browser

### Development

- Run locally:

  yarn start

- Build:

  yarn build

