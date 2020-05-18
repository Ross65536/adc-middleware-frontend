import React from 'react';

import ReactJson from 'react-json-view';
import JSONTree from 'react-json-tree';

import { toast } from 'react-toastify';

import Endpoint from './endpoint.js';

async function getJson(url) {
    const resp = await fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    });

    return resp.json();
}

export default class PublicEndpoint extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            response: "",
        };

        this.makeRequest = this.makeRequest.bind(this);
    }

    async makeRequest() {
        const url = `${process.env.REACT_APP_ADC_BASE_PATH}${this.props.url}`;
        const json = await getJson(url);
        this.setState(state => ({ response: json }));
    }

    render() {
        return (
            <Endpoint url={this.props.url} request={this.makeRequest} json={this.state.response} method="GET" />
        );
    }
}