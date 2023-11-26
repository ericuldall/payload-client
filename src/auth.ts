import type { Client } from './client';

type AuthOptions = {
	collectionSlug: string,
	tokenCookie: string,
}

interface Auth {
	client: Client,
	options: AuthOptions,


	login: (email: string, password: string) => Promise<void>,
	logout: () => Promise<void>,

	isAuthenticated: () => boolean,

	getUser: () => boolean | Object
}

class PayloadAuth implements Auth {
	client: Client
	options: AuthOptions

	constructor (client: Client, options?: AuthOptions) {
		this.client = client;
		this.options = {
			collectionSlug: 'users',
			tokenCookie: 'payload-token',
			...options
		};
	}
	
	async login (email: string, password: string) {
		const { user, exp } = await this.client.fetch(`${this.options.collectionSlug}/login`, {
			method: "POST", 
			body: JSON.stringify({
				email,
				password
			}),
		}).then(r => r.json());
		localStorage.setItem(this.options.tokenCookie, JSON.stringify({ user, exp }));
	}

	async logout () {
		await this.client.fetch(`${this.options.collectionSlug}/logout`, { method: 'POST' });
		localStorage.removeItem(this.options.tokenCookie);
	}

	isAuthenticated () {
		const token = localStorage.getItem(this.options.tokenCookie);
		if (token) {
			const { exp } = JSON.parse(token);
			return (exp * 1000)  < Date.now();
		}

		return false;
	}

	getUser () {
		const token = localStorage.getItem(this.options.tokenCookie);
		if (token) {
			const { user } = JSON.parse(token);
			return user;
		}

		return false;
	}
}

export const useAuth = (client: Client) => new PayloadAuth(client);
