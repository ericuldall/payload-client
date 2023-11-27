import type { Client, Service } from './client';
import { createClient } from './index';

let client: Client;
const apiURL = 'https://test';

const testSlug = 'my-collection';
type TestResponses = {
	[method: string]: any
}
const testResponses: TestResponses = {
	find: {
		"docs": [
			{
				"id": "644a5c24cc1383022535fc7c",
				"title": "Home",
				"content": "REST API examples",
				"slug": "home",
				"createdAt": "2023-04-27T11:27:32.419Z",
				"updatedAt": "2023-04-27T11:27:32.419Z"
			}
		],
		"totalDocs": 1,
		"limit": 10,
		"totalPages": 1,
		"page": 1,
		"pagingCounter": 1,
		"hasPrevPage": false,
		"hasNextPage": false,
		"prevPage": null,
		"nextPage": null
	},
	get: {
		"id": "644a5c24cc1383022535fc7c",
		"title": "Home",
		"content": "REST API examples",
		"slug": "home",
		"createdAt": "2023-04-27T11:27:32.419Z",
		"updatedAt": "2023-04-27T11:27:32.419Z"
	},
	create: {
		"message": "Page successfully created.",
		"doc": {
			"id": "644ba34c86359864f9535932",
			"title": "New page",
			"content": "Here is some content",
			"slug": "new-page",
			"createdAt": "2023-04-28T10:43:24.466Z",
			"updatedAt": "2023-04-28T10:43:24.466Z"
		}
	},
	update: {
		"message": "Updated successfully.",
		"doc": {
			"id": "644a5c24cc1383022535fc7c",
			"title": "I have been updated by ID!",
			"content": "REST API examples",
			"categories": {
				"id": "example-uuid",
				"name": "Test Category"
			},
			"tags": [
				{
					"relationTo": "location",
					"value": {
						"id": "another-example-uuid",
						"name": "Test Location"
					}
				}
			],
			"slug": "home",
			"createdAt": "2023-04-27T11:27:32.419Z",
			"updatedAt": "2023-04-28T10:47:59.259Z"
		}
	},
	delete: {
		"id": "644ba51786359864f9535954",
		"title": "New page",
		"content": "Here is some content",
		"slug": "new-page",
		"createdAt": "2023-04-28T10:51:03.028Z",
		"updatedAt": "2023-04-28T10:51:03.028Z"
	}
}

beforeAll(() => {
	client = createClient(apiURL);
});

describe('client module', () => {
	test('client endpoint matches apiURL', () => {
		expect(client.apiURL).toBe(apiURL);
	});

	describe('collections service', () => {
		let service: Service;

		beforeAll(() => {
			service = client.service(testSlug);
		});

		describe.each([
			['find', 'GET'],
			['get', 'GET', '644a5c24cc1383022535fc7c'],
			['create', 'POST', {
				title: "New page",
				content: "Here is some content"
			}],
			['update', 'PATCH', '644a5c24cc1383022535fc7c', {
				title: "I have been updated by ID!",
				categories: "example-uuid",
				tags: {
					relationTo: "location",
					value: "another-example-uuid"
				}
			}],
			['delete', 'DELETE', '644ba51786359864f9535954']
		])(`Testing %s method`, (serviceMethod, httpMethod, ...args) => {
			let baseEndpoint: string; 
			let lastCall: any;
			let res: any;
			

			beforeAll(async () => {
				baseEndpoint = `${client.apiURL}/api/${testSlug}`;
				fetchMock.mockResponseOnce(JSON.stringify(testResponses[serviceMethod]));
				// @ts-expect-error
				res = await service[serviceMethod](...args);
				lastCall = fetchMock.mock.lastCall;
			});

			test('endpoint url is valid', () => {
				let validEndpoint = baseEndpoint;
				if (['get', 'update', 'delete'].includes(serviceMethod)) {
					validEndpoint += `/${args[0]}`;
				}
				expect(lastCall[0]).toBe(validEndpoint);
			});

			test(`method is ${httpMethod}`, () => {
				expect(lastCall[1].method).toBe(httpMethod);
			});

			test(`response matches testResponses.${serviceMethod}`, () => {
				expect(res).toStrictEqual(testResponses[serviceMethod]);
			});
			
			afterAll(() => {
				fetchMock.resetMocks()
			})
		});
	});
});
