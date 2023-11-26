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
	// do a login, cookie will be stored and passed automatically by the client
	await auth.login('email', 'password');
	
	// query some users
	const { docs } = await client.service('users').find({ where: { email: { equals: 'myemail' } } });
	console.log(docs);
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

### That's all it does for now, will update as it evolves
