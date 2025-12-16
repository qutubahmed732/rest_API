export function logProxy(response: Request) {
    return { response: response.method + " " + response.url };
};