import type { Client } from './client';
export const useAuth = (client: Client) => ({
	async login (email: string, password: string) {
		const { user } = await client.fetch('users/login', {
			method: "POST", 
			body: JSON.stringify({
				email,
				password
			}),
		}).then(r => r.json());
		localStorage.setItem('payload-user', JSON.stringify(user));
	},
	isAuthenticated () {
		
	}
})
