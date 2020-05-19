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
            limit: "",
            from: ""
        };

        this.makeRequest = this.makeRequest.bind(this);
        this.buildRequest = this.buildRequest.bind(this);
    }

    buildRequest() {
        const ret = {};
        if (this.state.isPublic) {
            ret.fields = this.props.publicFields;
        }

        if (this.state.limit !== "") {
            const num = parseInt(this.state.limit);
            ret.size = num;
        }

        if (this.state.from !== "") {
            const num = parseInt(this.state.from);
            ret.from = num;
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
                name={this.props.url} 
                request={this.makeRequest} 
                json={this.state.response} 
                method="POST"
                requestDisabled={this.props.token === ""}
            >
                <div class="w-100">
                    <div class="d-flex justify-content-between">
                        <div class="form-check">
                            <input name="isPublic" class="form-check-input" type="checkbox" value="" id="publicFields"
                                checked={this.state.isPublic}
                                onChange={e => this.setState({...this.state, isPublic: e.target.checked})}
                                />
                            <label class="form-check-label" for="publicFields">
                                Public Fields?
                            </label>
                        </div>

                        <div class="form-group d-flex">
                            <label for="limitInput">Size: </label>
                            <input type="number" class="form-control ml-2" id="limitInput" min="0"
                                value={this.state.limit} 
                                onChange={(event) => this.setState({...this.state, limit: event.target.value})}
                            />
                        </div>

                        <div class="form-group d-flex">
                            <label for="fromInput">From: </label>
                            <input type="number" class="form-control ml-2" id="fromInput" min="0"
                                value={this.state.from} 
                                onChange={(event) => this.setState({...this.state, from: event.target.value})}
                            />
                        </div>
                    </div>

                    <span class="text-left">
                        <JSONTree data={this.buildRequest()} />
                    </span>
                </div>
            </Endpoint>
        );
    }
}