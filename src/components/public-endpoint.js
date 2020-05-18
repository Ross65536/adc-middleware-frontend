
import React from 'react';

export default class PublicEndpoint extends React.Component {


    render() {
        return (
            <div class="">
                <div class="bg-secondary text-white d-flex justify-content-between px-3 py-2"> 
                    <span style={{"font-size":30}}>
                        GET <b>{this.props.url}</b>
                    </span>
                    <button class="btn btn-primary">Request</button>
                </div>
                <div class="bg-light">
                    <b>Response:</b> <br/>
                    <span>AA</span>
                </div>
            </div>
        );
    }
}