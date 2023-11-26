import qs from 'qs';
class PayloadClient {
    constructor(apiURL) {
        this.apiURL = apiURL;
    }
    fetch(endpoint, options = {}) {
        const where = options === null || options === void 0 ? void 0 : options.where;
        options === null || options === void 0 ? true : delete options.where;
        const query = where ? `?${qs.stringify({ where })}` : '';
        return fetch(`${this.apiURL}/api/${endpoint}${query}`, Object.assign({ credentials: "include", headers: {
                "Content-Type": "application/json",
            } }, options));
    }
    service(endpoint) {
        return {
            find: (options) => {
                return this.fetch(endpoint, options);
            },
            get: (id, options) => {
                return this.fetch(`${endpoint}/${id}`, options);
            },
            create: (data, options) => {
                return this.fetch(`${endpoint}`, Object.assign({ method: 'POST', body: JSON.stringify(data) }, options));
            },
            update: (id, data, options) => {
                return this.fetch(`${endpoint}/${id}`, Object.assign({ method: 'PATCH', body: JSON.stringify(data) }, options));
            },
            delete: (id, options) => {
                return this.fetch(`${endpoint}/${id}`, Object.assign({ method: 'DELETE' }, options));
            }
        };
    }
}
export const createClient = (apiURL) => new PayloadClient(apiURL);
