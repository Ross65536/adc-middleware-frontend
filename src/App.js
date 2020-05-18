import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';

import './App.css';

import PublicEndpoint from './components/public-endpoint.js';

function App() {
  return (
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
      </nav>

      {/* BODY */}
      <div class="container mt-5">
        <PublicEndpoint url="/info"/>
      </div>
    </div>
  );
}

export default App;
