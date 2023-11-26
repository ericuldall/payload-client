import qs from 'qs';

type Service = {
	find: (options: any) => Promise<any>,
	get: (id: string, options: any) => Promise<any>,
	create: (data: any, options: any) => Promise<any>,
	update: (id: string, data: any, options: any) => Promise<any>,
	delete: (id: string, options: any) => Promise<any>
}

interface Client {
	apiURL: string,
	fetch: (endpoint: string, options?: any) => Promise<Response>,
	service: (endpoint: string) => Service 
} 

class PayloadClient implements Client {
	apiURL

	constructor (apiURL: string) {
		this.apiURL = apiURL;
	}

	fetch (endpoint: string, options: any = {}) {
		const where = options?.where;
		delete options?.where;
		const query = where ? `?${qs.stringify({ where })}` : '';
		return fetch(`${this.apiURL}/api/${endpoint}${query}`, {
			credentials: "include",
			headers: {
			  "Content-Type": "application/json",
			},
			...options
		});
	}

	service (endpoint: string) {
		return {
			find: (options: any) => {
				return this.fetch(endpoint, options);
			},
			get: (id: string, options: any) => {
				return this.fetch(`${endpoint}/${id}`, options);
			},
			create: (data: any, options: any) => {
				return this.fetch(`${endpoint}`, {
					method: 'POST',
					body: JSON.stringify(data),
					...options
				});
			},
			update: (id: string, data: any, options: any) => {
				return this.fetch(`${endpoint}/${id}`, {
					method: 'PATCH',
					body: JSON.stringify(data),
					...options
				});
			},
			delete: (id: string, options: any) => {
				return this.fetch(`${endpoint}/${id}`, {
					method: 'DELETE',
					...options
				});
			}
		}
	}
}

export const createClient = (apiURL: string) => new PayloadClient(apiURL);

export { Service, Client }
