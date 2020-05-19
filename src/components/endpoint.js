import React from 'react';

import JSONTree from 'react-json-tree';

export default class Endpoint extends React.Component {

    constructor(props) {
        super(props);

        this.response = this.response.bind(this);
        this.name = this.name.bind(this);
    }

    response() {
        if (this.props.json != "") {
            return (
                <span class="text-left">
                    <JSONTree data={this.props.json} />
                </span>
            );
        }
    }

    name() {
        if (this.props.name === undefined) {
            return this.props.url;
        }

        return this.props.name;
    }

    render() {
        return (
            <div class="mb-3">
                <div class="bg-secondary text-white px-3 py-2"> 
                    <div class=" d-flex justify-content-between">
                        <span style={{fontSize:30}}>
                            {this.props.method} <b>{this.name()}</b>
                        </span>
                        <button class="btn btn-primary" onClick={this.props.request}>Request</button>
                    </div>

                    <div class="mt-2">
                        {this.props.children}
                    </div>
                    <div>
                        {this.response()}
                    </div>
                </div>
            </div>
        );
    }
}