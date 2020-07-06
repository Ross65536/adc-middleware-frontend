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

export async function postJson(url, bearerToken) {
    const headers = {
        "Authorization": `Bearer ${bearerToken}`
    }
    return await requestJson(url, "POST", {}, headers);
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

async function protectedRequest(url, userToken, method, extraOptions = {}, extraHeaders = {}) {
    let ticket = null;
    try {
        return await requestJson(url, method, extraOptions, extraHeaders);
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
        ... extraHeaders,
        "Authorization": `Bearer ${rpt.access_token}`
    }

    return await requestJson(url, method, extraOptions, resourceHeaders);
}

export async function getProtectedJson(url, userToken) {
    return await protectedRequest(url, userToken, "GET");
}

export async function postProtectedJson(url, userToken, body) {
    const options = {
        body: JSON.stringify(body)
    };
    const headers = {
        "Content-Type": 'application/json'
    };

    return await protectedRequest(url, userToken, "POST", options, headers);
}

function parseJson(string) {
    try {
        return JSON.parse(string);
    } catch (e) {
        return null;
    }
}

export async function catchHttpErrors(body, errorMsg = null) {
    try {
        return await body();
    } catch (e) {
        if (!('status' in e && 'body' in e)) 
            throw e;

        const msg = `Error ${e.method} ${e.url} status: ${e.status} body: ${e.body}`;
        
        const json = parseJson(e.body);
        if (e.status === 403 && json !== null && 'error_description' in json && json['error_description'] === 'request_submitted') {
            console.log(msg);
            toast.info("Request to access resource submitted");
            return;
        }
        
        console.error(msg);

        if (errorMsg == null) {
            errorMsg = `Error making request (${e.status})`;
        }
        toast.error(errorMsg);
    }
}