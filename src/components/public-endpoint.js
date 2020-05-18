
import React from 'react';

async function getJson(url) {
    const respo = await fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    });

    return respo.text();
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
        const url = `${process.env.REACT_APP_ADC_BASE}${this.props.url}`;
        const json = await getJson(url);
        this.setState(state => ({ response: json }));
    }

    render() {
        return (
            <div class="">
                <div class="bg-secondary text-white d-flex justify-content-between px-3 py-2"> 
                    <span style={{"font-size":30}}>
                        GET <b>{this.props.url}</b>
                    </span>
                    <button class="btn btn-primary" onClick={this.makeRequest}>Request</button>
                </div>
                <div class="bg-light">
                    <b>Response:</b> <br/>
                    <span>{this.state.response}</span>
                </div>
            </div>
        );
    }
}