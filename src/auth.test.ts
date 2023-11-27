import type { Client } from './client';
import type { Auth } from './auth';
import { createClient, useAuth } from './index';

let client: Client;
let auth: Auth;

const authResponse = {
	"message": "Auth Passed",
	"user": {
		"id": "644b8453cd20c7857da5a9b0",
		"email": "dev@payloadcms.com",
		"_verified": true,
		"createdAt": "2023-04-28T08:31:15.788Z",
		"updatedAt": "2023-04-28T11:11:03.716Z"
	},
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
	"exp": Math.floor((Date.now() + 60 *60 * 1000)/1000)
};

const login = () => {
	fetchMock.mockResponseOnce(JSON.stringify(authResponse));
	return auth.login('foo', 'bar');
}

const logout = () => {
	fetchMock.mockResponseOnce(
		JSON.stringify({
			"message": "You have been logged out successfully."
		})
	);
	return auth.logout();
}

beforeAll(() => {
	client = createClient('http://test');
	auth = useAuth(client);
});

describe('auth module', () => {
	beforeEach(() => {
		fetchMock.resetMocks()
	})

	test('test successful login', async () => {
		await login();
		expect(localStorage.setItem)
			.toHaveBeenLastCalledWith(
				auth.options.tokenCookie,
				JSON.stringify({ user: authResponse.user, exp: authResponse.exp })
			);
	});

	test('test successful logout', async () => {
		await logout();
		expect(localStorage.removeItem)
			.toHaveBeenLastCalledWith(auth.options.tokenCookie);
	});

	describe('utility tests', () => {
		describe('logged out', () => {
			test('isAuthenticated() should be false', () => {
				expect(auth.isAuthenticated()).toBe(false);
			});
		
			test ('getUser() should be false', () => {
				expect(auth.getUser()).toBe(false);
			});
		});

		describe('logged in', () => {
			beforeAll(async () => {
				await login();
			});
			
			test('isAuthenticated() should be true', () => {
				expect(auth.isAuthenticated()).toBe(true);
			});
		
			test ('getUser() should match authResponse.user', () => {
				expect(auth.getUser()).toStrictEqual(authResponse.user);
			});

			afterAll(async () => {
				await logout();
			});
		});
	});
});
