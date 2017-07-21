const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const schema = require('./src/schema');

const app = express();

app.use(bodyParser.json());
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
}))

app.listen(3000, () => console.log(`Running on port ${3000}`));