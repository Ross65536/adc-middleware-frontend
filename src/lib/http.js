

export async function getJson(url) {
    const resp = await fetch(url, {
        headers: {
            'Accept': 'application/json'
        }
    });

    return resp.json();
}
