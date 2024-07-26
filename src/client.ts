import qs from 'qs';

type OptionsMethod = (options?: any) => Promise<any>
type IdAndOptionsMethod = (id: string, options?: any) => Promise<any>
type DataAndOptionsMethod = (data: any, options?: any) => Promise<any>
type IdDataAndOptionsMethod = (id: string, data: string, options?: any) => Promise<any>

type Service = {
	find: OptionsMethod,
	get: IdAndOptionsMethod,
	create: DataAndOptionsMethod,
	update: IdDataAndOptionsMethod,
	delete: IdAndOptionsMethod
}

interface Client {
	apiURL: string,
	fetch: (endpoint: string, options?: any) => Promise<any>,
	service: (endpoint: string) => Service 
} 

class PayloadClient implements Client {
	apiURL: string

	constructor (apiURL: string) {
		this.apiURL = apiURL;
	}

	fetch (endpoint: string, options: any = {}) {
		const where = options?.where;
		delete options?.where;
		const query = where ? qs.stringify({ where }, { addQueryPrefix: true }) : '';
		const fetchOptions = {
			credentials: "include",
			method: "GET",
			headers: {
			  "Content-Type": "application/json",
			},
			...options
		};
		return fetch(
			`${this.apiURL}/api/${endpoint}${query}`,
			fetchOptions
		).then(r => r.json());
	}

	service (endpoint: string) {
		return {
			find: (options?: any) => {
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
