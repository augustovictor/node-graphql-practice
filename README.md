# node-graphql-practice

## Concepts
- No more underfetching or overfetching
- Schema
- Queries: Fetch
    - Query resolver: How queries are handled
- Mutations: Insert/Update/Delete/Auth
    - Used when a client need to perform any operation from server side
- Subscription

## Workflow
1. Update the schema to define the new type and mutation;
2. Create a new MongoDB collection to store entities;
3. Add a resolver for the mutation, using the DB to store data;
4. Test if it is working :)

## Scripts
### SignIn
```js
mutation SignIn {
  signinUser(
    email: {
      email: "victoraweb@gmail.com"
      password: "12345"
    }
  ) {
    token
    user {
      name
      email
    }
  }
}
```

### CreateLink
```js
mutation CreateLink {
  createLink(
    url:"urlcomplete"
    description:"urlcomplete description"
  ) {
    id url description
    postedBy{
      name
    }
  }
}
```

### Create vote
```js
mutation CreateVote {
  createVote(linkId: "597258520c3c1621651c3b26") {
    id
    user {name}
    link {url}
  }
}
```