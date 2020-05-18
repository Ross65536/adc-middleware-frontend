import { toast } from 'react-toastify';

async function requestJson(url, method = "GET", extraOptions = {}, extraHeaders = {}) {

    const options = {
        method: method,
        headers: {
            'Accept': 'application/json',
            ... extraHeaders
        },
        ... extraOptions
    };

    const resp = await fetch(url, options);

    const family = Math.floor(resp.status / 100);
    if (family !== 2) {
        const text = await resp.text();
        let headers = {};
        for (var pair of resp.headers.entries()) {
            headers[pair[0]] = pair[1];
        }

        throw {
            method: method,
            url: url,
            status: resp.status,
            headers: headers,
            body: text,
        }
    } 

    return resp.json();
} 

export async function getJson(url) {
    return await requestJson(url);
}

function urlEncode(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

async function postForm(url, body, bearer) {
    const form = urlEncode(body);
    const options = {
        body: form
    };
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${bearer}`
    };
    return await requestJson(url, "POST", options, headers);
} 

const WWW_AUTH_HEADER = "www-authenticate";
const TICKET_CAPTURE = /.*ticket=\"(.*)\".*/;

export async function getProtectedJson(url, userToken) {
    let ticket = null;
    try {
        return await requestJson(url);
    } catch (e) {
        if (e.status !== 401 || !(WWW_AUTH_HEADER in e.headers)) {
            throw e;
        }

        const header = e.headers[WWW_AUTH_HEADER];
        if (! header.match(TICKET_CAPTURE)) {
            console.error("Misssing ticket in header");
            throw e;
        }

        ticket = TICKET_CAPTURE.exec(header)[1];
    }

    const tokenBody = {
        grant_type: "urn:ietf:params:oauth:grant-type:uma-ticket",
        ticket: ticket
    };

    const discovery = await getJson(process.env.REACT_APP_UMA_DISCOVERY_DOCUMENT_PATH);

    const rpt = await postForm(discovery.token_endpoint, tokenBody, userToken);

    const resourceHeaders = {
        "Authorization": `Bearer ${rpt.access_token}`
    }

    return await requestJson(url, "GET", {}, resourceHeaders);
}



export async function catchHttpErrors(body) {

    try {
        await body();
    } catch (e) {
        const msg = `Error ${e.method} ${e.url} status: ${e.status} body: ${e.body}`;
        console.error(msg);
        toast.error(`Error making request (${e.status})`);
    }
}