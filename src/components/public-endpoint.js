import React from 'react';

import Endpoint from './endpoint.js';
import { getJson, catchHttpErrors } from '../lib/http.js';

export default class PublicEndpoint extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            response: "",
        };

        this.makeRequest = this.makeRequest.bind(this);
    }

    async makeRequest() {
        this.setState({...this.state, response: ""});
        
        const url = `${process.env.REACT_APP_ADC_BASE_PATH}${this.props.url}`;
        catchHttpErrors(async () => {
            const json = await getJson(url);
            this.setState(state => ({ response: json }));
        });
    }

    render() {
        return (
            <Endpoint url={this.props.url} request={this.makeRequest} json={this.state.response} method="GET" />
        );
    }
}