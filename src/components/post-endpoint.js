import React from 'react';

import Endpoint from './endpoint.js';
import { postProtectedJson, catchHttpErrors } from '../lib/http.js';

export default class PostEndpoint extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            response: "",
        };

        this.makeRequest = this.makeRequest.bind(this);
    }

    async makeRequest() {
        const url = `${process.env.REACT_APP_ADC_BASE_PATH}${this.props.url}`;
        const request = {};
        catchHttpErrors(async () => {
            let json = await postProtectedJson(url, this.props.token, request);
            if (this.props.responseField in json) {
                json = json[this.props.responseField];
            }
            this.setState({ ...this.state, response: json });
        });
    }

    render() {
        return (
            <Endpoint 
                url={this.props.url} 
                name={`${this.props.url}/{id}`} 
                request={this.makeRequest} 
                json={this.state.response} 
                method="POST"
                requestDisabled={this.props.token === ""}
            >
                
            </Endpoint>
        );
    }
}