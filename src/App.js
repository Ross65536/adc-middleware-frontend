
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';

import './App.css';

import PublicEndpoint from './components/public-endpoint.js';

import { KeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.saveTokens = this.saveTokens.bind(this);
  }

  saveTokens(tokens) {
    console.log(tokens);
  }

  render() {
    return (
      <KeycloakProvider onTokens={this.saveTokens} keycloak={keycloak}>
        <div className="App">
          {/* HEADER */}
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">ADC Middleware Frontend</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link" href="#">Home</a>
                </li>
                <li class="nav-item">
                  <span class="nav-link">
                    ADC Base: {process.env.REACT_APP_ADC_BASE_PATH}
                  </span>
                </li>
              </ul>
            </div>
            <button class="btn btn-primary" onClick={() => keycloak.login()}>Login</button>
          </nav>
    
          {/* BODY */}
          <div class="container mt-5">
            <PublicEndpoint url="/info"/>
          </div>
        </div>
      </KeycloakProvider>
    );
  }
  
};

