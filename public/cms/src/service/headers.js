const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
};

if (sessionStorage.token) {
    headers['Auth-Token'] = sessionStorage.token;
}

export default headers;
