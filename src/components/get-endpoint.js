import React from 'react';

import Endpoint from './endpoint.js';
import { getProtectedJson, catchHttpErrors } from '../lib/http.js';

export default class GetEndpoint extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: "",
            response: "",
        };

        this.makeRequest = this.makeRequest.bind(this);
    }

    async makeRequest() {
        const url = `${process.env.REACT_APP_ADC_BASE_PATH}${this.props.url}/${this.state.id}`;
        catchHttpErrors(async () => {
            let json = await getProtectedJson(url, this.props.token);
            if (this.props.responseField in json) {
                json = json[this.props.responseField];
                if (json.length === 1) {
                    json = json[0];
                }
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
                method="GET"
                requestDisabled={this.props.token === ""}
            >
                <input type="text" class="form-control" placeholder="resource id" value={this.state.id} onChange={(event) => this.setState({...this.state, id: event.target.value})}/>
            </Endpoint>
        );
    }
}