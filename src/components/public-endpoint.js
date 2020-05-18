import React from 'react';

import ReactJson from 'react-json-view';
import JSONTree from 'react-json-tree';

import { toast } from 'react-toastify';

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
        this.response = this.response.bind(this);
    }

    async makeRequest() {
        const url = `${process.env.REACT_APP_ADC_BASE_PATH}${this.props.url}`;
        const json = await getJson(url);
        toast("OK");
        this.setState(state => ({ response: json }));
    }

    response() {
        if (this.state.response != "") {
            return (
                <span class="text-left">
                    {/* <ReactJson enableClipboard={false} displayDataTypes={false} theme="monokai" src={this.state.response} /> */}
                    <JSONTree data={this.state.response} />
                </span>
            );
        }
    }

    render() {
        return (
            <div class="">
                <div class="bg-secondary text-white d-flex justify-content-between px-3 py-2"> 
                    <span style={{fontSize:30}}>
                        GET <b>{this.props.url}</b>
                    </span>
                    <button class="btn btn-primary" onClick={this.makeRequest}>Request</button>
                </div>
                <div class="bg-light d-block">
                    <b>Response:</b> <br/>
                    {this.response()}
                </div>
            </div>
        );
    }
}