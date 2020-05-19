
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useKeycloak, KeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak.js';

import './App.css';
import PublicEndpoint from './components/public-endpoint.js';
import GetEndpoint from './components/get-endpoint.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: ""
    }

    this.saveTokens = this.saveTokens.bind(this);
    this.isLoggedIn = this.isLoggedIn.bind(this);
    this.loginMsg = this.loginMsg.bind(this);
  }

  saveTokens(tokens) {
    if (tokens.token !== undefined) {
      this.setState(state => ({ token: tokens.token }));
    }
  }

  isLoggedIn() {
    return this.state.token !== "";
  }

  loginMsg() {
    if (! this.isLoggedIn()) {
      return (
      <span>
        <i class="fas fa-circle mr-1" style={{color: 'red'}}></i>
        NOT logged in
      </span>
      );
    }

    return (
      <span>
        <i class="fas fa-circle mr-1" style={{color: 'green'}}></i>
        Logged In
      </span>
    );
  }

  render() {
    return (
      <KeycloakProvider 
        onTokens={this.saveTokens} keycloak={keycloak}
        onAuthSuccess={()=>toast("Logged in")}
        onAuthError={()=>toast("Login error")}
      >
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
                  <span class="nav-link">
                    ADC URL: {process.env.REACT_APP_MIDDLEWARE_URL + process.env.REACT_APP_ADC_BASE_PATH}
                  </span>
                </li>
              </ul>
            </div>

            {this.loginMsg()}
            <button class="btn btn-primary ml-2" onClick={() => keycloak.login()}>Login</button>
            <button class="btn btn-primary ml-2" onClick={() => this.setState({ ...this.state, token: "" })} disabled={!this.isLoggedIn()}>Logout</button>
          </nav>
    
          {/* BODY */}
          <div class="container mt-5">
            <PublicEndpoint url="/info"/>
            <GetEndpoint url="/repertoire" token={this.state.token} responseField="Repertoire"/>
            <GetEndpoint url="/rearrangement" token={this.state.token} responseField="Rearrangement"/>
          </div>

          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
        </div>

        
      </KeycloakProvider>
    );
  }
  
};

