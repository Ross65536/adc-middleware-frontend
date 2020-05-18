
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useKeycloak, KeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak.js';

import './App.css';
import PublicEndpoint from './components/public-endpoint.js';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: ""
    }

    this.saveTokens = this.saveTokens.bind(this);
  }

  saveTokens(tokens) {
    if (tokens.token !== undefined) {
      this.setState(state => ({ token: tokens.token }));
    }
    console.log(tokens);
  }

  render() {
    // const { keycloak, initialized } = useKeycloak();
    
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
          <div class="mt-5">
            Token: {this.state.token}
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

