import React from 'react';

import Endpoint from './endpoint.js';
import { getProtectedJson, catchHttpErrors } from '../lib/http.js';

export default class GetEndpoint extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "5e53de7f9463684866be6092",
            response: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.makeRequest = this.makeRequest.bind(this);
    }

    async makeRequest() {
        const url = `${process.env.REACT_APP_ADC_BASE_PATH}${this.props.url}/${this.state.id}`;
        catchHttpErrors(async () => {
            const json = await getProtectedJson(url, this.props.token);
            this.setState({ ...this.state, response: json });
        });
    }

    handleChange(event) {    
        this.setState({...this.state, id: event.target.value});  
    }

    render() {
        return (
            <Endpoint 
                url={this.props.url} 
                name={`${this.props.url}/{repertorie_id}`} 
                request={this.makeRequest} 
                json={this.state.response} 
                method="GET"
                requestDisabled={this.props.token === ""}
            >
                <input type="text" class="form-control" placeholder="resource id" value={this.state.id} onChange={this.handleChange}/>
            </Endpoint>
        );
    }
}