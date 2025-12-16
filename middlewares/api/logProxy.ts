export function logProxy(req: Request): any {
    return { response: req.method + " " + req.url };
};