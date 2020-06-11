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
            from: "",
            searchType: true,
            facet: "",
            include_fields: "",
            showRequest: false,
            loading: false,
        };

        this.makeRequest = this.makeRequest.bind(this);
        this.buildRequest = this.buildRequest.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.facetsOptions = this.facetsOptions.bind(this);
        this.requestDisabled = this.requestDisabled.bind(this);
        
    }

    buildRequest() {
        const ret = {};

        if (this.state.searchType && this.state.isPublic) {
            ret.fields = this.props.publicFields;
        }

        if (!this.state.searchType && this.state.facet !== "") {
            ret.facets = this.state.facet
        }

        if (this.state.searchType && this.state.include_fields !== "") {
            ret.include_fields = this.state.include_fields
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
        this.setState({ ...this.state, response: "", loading: true });

        const url = `${process.env.REACT_APP_ADC_BASE_PATH}${this.props.url}`;
        const request = this.buildRequest();
        catchHttpErrors(async () => {
            let json = await postProtectedJson(url, this.props.token, request);
            if (this.props.responseField in json) {
                json = json[this.props.responseField];
            } else if ("Facet" in json) {
                json = json["Facet"];
            }
            this.setState({ ...this.state, response: json, loading: false });
        });
    }

    handleChange(val) {
        this.setState({ ...this.state, searchType: val.target.value === "search" });
    }

    facetsOptions() {
        const ret = [];

        for (let field of this.props.fields) {
            ret.push(<option>{field}</option>);
        }

        return ret;
    }

    requestDisabled() {
        const isPublicFacets = this.state.facet !== "" && this.props.publicFields.includes(this.state.facet); 
        const isPublicSeach = this.state.isPublic && this.state.include_fields === "";
        return !isPublicSeach && !isPublicFacets && this.props.token === "";
    }

    render() {
        return (
            <Endpoint
                url={this.props.url}
                name={this.props.url}
                request={this.makeRequest}
                json={this.state.response}
                method="POST"
                requestDisabled={this.requestDisabled()}
                isLoading={this.state.loading}
                title={this.props.title}
            >
                <div class="w-100">

                    <div class="d-flex justify-content-between">

                        <div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name={this.props.url}  value="search" onChange={this.handleChange} checked={this.state.searchType} />
                                <label class="form-check-label">
                                    Search
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name={this.props.url}  value="facets" onChange={this.handleChange} checked={!this.state.searchType}/>
                                <label class="form-check-label">
                                    Facets
                                </label>
                            </div>
                        </div>

                        {
                            this.state.searchType ?
                                (
                                    this.props.publicFields.length !== 0 && 
                                    <div class="form-check">
                                        <input name="isPublic" class="form-check-input" type="checkbox" value="" id="publicFields"
                                            checked={this.state.isPublic}
                                            onChange={e => this.setState({ ...this.state, isPublic: e.target.checked })}
                                        />
                                        <label class="form-check-label" for="publicFields">
                                            Public Fields?
                                        </label>
                                    </div>                           
                                ) : (
                                    <div class="form-group d-flex">
                                        <label for="facetsInput" class="justify-content-center align-self-center">Facets: </label>
                                        <select class="form-control ml-1" style={{width: '15rem'}} id="facetsInput" onChange={e => this.setState({ ...this.state, facet: e.target.value })}>
                                            <option value="">--</option>
                                            {this.facetsOptions()}
                                        </select>
                                    </div>
                                )
                        }

                        {
                            this.state.searchType &&
                            <div class="form-group d-flex ml-3">
                                <label for="facetsInput" class="justify-content-center align-self-center">Include Fields: </label>
                                <select class="form-control ml-1" style={{width: '5rem'}} id="facetsInput" onChange={e => this.setState({ ...this.state, include_fields: e.target.value })}>
                                    <option value="">--</option>
                                    <option>miairr</option>
                                    <option>airr-core</option>
                                    <option>airr-schema</option>
                                </select>
                            </div>
                        }

                        <div class="form-group d-flex">
                            <label for="limitInput" class="justify-content-center align-self-center">Size: </label>
                            <input type="number" class="form-control ml-2" id="limitInput" min="0"
                                style={{width: '5rem'}}
                                value={this.state.limit}
                                onChange={(event) => this.setState({ ...this.state, limit: event.target.value })}
                            />
                        </div>

                        <div class="form-group d-flex">
                            <label for="fromInput" class="justify-content-center align-self-center">From: </label>
                            <input type="number" class="form-control ml-2" id="fromInput" min="0"
                                style={{width: '5rem'}}
                                value={this.state.from}
                                onChange={(event) => this.setState({ ...this.state, from: event.target.value })}
                            />
                        </div>

                        <div class="form-check">
                            <input name="isPublic" class="form-check-input" type="checkbox" value="" id="requestShow"
                                checked={this.state.showRequest}
                                onChange={e => this.setState({ ...this.state, showRequest: e.target.checked })}
                            />
                            <label class="form-check-label" for="requestShow">
                                Show Request?
                            </label>
                        </div>
                    </div>

                    {this.state.showRequest && (
                        <span class="text-left">
                            <JSONTree data={this.buildRequest()} />
                        </span>
                    )}
                </div>
            </Endpoint>
        );
    }
}