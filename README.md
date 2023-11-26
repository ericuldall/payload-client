# Payload Client
A simple javascript client for your payload CMS api. Designed to rapidly extend your headless CMS with your favorite js framework

## Installation
```
npm i --save payload-client
```

## Configuration
First let's create a file to define our basic client config + auth adapter

__payload.js__
```
import { createClient, useAuth } from 'payload-client'

const client = createClient('http://localhost:3000');
const auth = useAuth(client);

export { client, auth }
```

## Usage
Now that we've configured our client, let's try it out in any other file

```
import { auth, client } from './payload.js'

(async () => {
	await auth.login('EMAIL', 'PASSWORD'); // you can catch errors here if you want, or just let it crash
	console.log('AUTHENTICATED:', auth.isAuthenticated()); // should return true
	console.log('USER', auth.getUser()); // should return your user object
	await client.service('users').find(); // should return all users (depending on api permissions)
	await auth.logout(); // you can catch errors here too
	console.log('AUTHENTICATED:', auth.isAuthenticated()); // should return false
	console.log('USER', auth.getUser()); // should return false
	await client.service('users').find(); // should return empty results (depending on api permissions)
});
```

## Service Methods
```
find (options);
get (id, options);
create (data, options);
update (id, data, options);
delete (id, options);
```

## The Options Argument
```
{
	where: {},
	/**
	 * Extra options get put into fetch options
	 *
	 * fetch(url, { ...overloadFetch })
	 * See Fetch Docs: https://developer.mozilla.org/en-US/docs/Web/API/fetch#options
	 */
	...overloadFetch
}
```

## Auth Utilities
```
async login(username, password) => Promise<void>
async logout() => Promise<void>
isAuthenticated() => boolean
getUser() => Object | boolean
```

### That's all it does for now, will update as it evolves
