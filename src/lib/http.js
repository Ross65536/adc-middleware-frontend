import { toast } from 'react-toastify';


export async function getJson(url) {
    const resp = await fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    });

    const family = Math.floor(resp.status / 100);
    if (family !== 2) {
        const text = await resp.text();
        throw {
            method: "GET",
            url: url,
            status: resp.status,
            body: text,
        }
    } 

    return resp.json();
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