import React from 'react';
import JSONTree from 'react-json-tree';

import Endpoint from './endpoint.js';
import { postProtectedJson, catchHttpErrors } from '../lib/http.js';

export default class PostEndpoint extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            response: "",
            isPublic: false,
        };

        this.makeRequest = this.makeRequest.bind(this);
        this.buildRequest = this.buildRequest.bind(this);
    }

    buildRequest() {
        const ret = {};
        if (this.state.isPublic) {
            ret.fields = this.props.publicFields;
        }

        return ret;
    }

    async makeRequest() {
        this.setState({...this.state, response: ""});

        const url = `${process.env.REACT_APP_ADC_BASE_PATH}${this.props.url}`;
        const request = this.buildRequest();
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
                <div class="form-check">
                    <input name="isPublic" class="form-check-input" type="checkbox" value="" id="publicFields"
                        checked={this.state.isPublic}
                        onChange={e => this.setState({...this.state, isPublic: e.target.checked})}
                    />
                    <label class="form-check-label" for="publicFields">
                        Public Fields?
                    </label>

                    <span class="text-left">
                        <JSONTree data={this.buildRequest()} />
                    </span>
                </div>
            </Endpoint>
        );
    }
}