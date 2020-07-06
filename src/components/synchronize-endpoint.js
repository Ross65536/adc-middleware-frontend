import React from 'react';

import Endpoint from './endpoint.js';
import { postJson, catchHttpErrors } from '../lib/http.js';

export default class SynchronizeEndpoint extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            password: "",
            response: "",
            loading: false
        };

        this.makeRequest = this.makeRequest.bind(this);
    }

    async makeRequest() {
        this.setState({ ...this.state, response: "", loading: true });
        
        const url = `${process.env.REACT_APP_ADC_BASE_PATH}/synchronize`;
        await catchHttpErrors(async () => {
            let json = await postJson(url, this.state.password);
            this.setState({ ...this.state, response: json, loading: false });
        }, "Invalid password");

        this.setState({ ...this.state, loading: false });
    }

    render() {
        return (
            <Endpoint 
                url={this.props.url} 
                name={`/v1/synchronize`} 
                request={this.makeRequest} 
                json={this.state.response} 
                method="POST"
                requestDisabled={this.state.password === ""}
                title={"Synchronize Middleware & Keycloak State"}
                isLoading={this.state.loading}
            >
                <input type="password" class="form-control" placeholder="password" value={this.state.password} onChange={(event) => this.setState({...this.state, password: event.target.value})}/>
            </Endpoint>
        );
    }
}