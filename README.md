# Frontend for ADC middleware server

## Instructions

### Setup

1. Install deps

```bash
yarn i
```

2. Setup keycloak

Start keycloak and then create a new client in the `Clients` tab: load (import) and save the client from the file `config/front-end.json`. Go to `Installation` tab in the client and download the `Keycloak OIDC JSON` format and place in `public/keycloak.json`, you will need to replace the value's `auth-server-url` host with with the front-ends's server value (e.g. cahnge to `http://localhost:3000/auth/`).


> If you run the middleware server or keycloak server in unexpected ports you need to update `.env`

### Development

- Run locally:

  yarn start

- Build:

  yarn build

