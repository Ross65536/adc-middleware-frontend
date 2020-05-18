import React from 'react';

import Endpoint from './endpoint.js';
import { getJson } from '../lib/http.js';

export default class GetEndpoint extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            response: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.makeRequest = this.makeRequest.bind(this);
    }

    async makeRequest() {
        const url = `${process.env.REACT_APP_ADC_BASE_PATH}${this.props.url}/${this.state.id}`;
        const json = await getJson(url);
        this.setState({ ...this.state, response: json });
    }

    handleChange(event) {    
        this.setState({...this.state, id: event.target.value});  
    }

    render() {
        return (
            <Endpoint url={this.props.url} request={this.makeRequest} json={this.state.response} method="GET" >
                <input type="text" class="form-control" placeholder="resource id" value={this.state.id} onChange={this.handleChange}/>
            </Endpoint>
        );
    }
}