const express                             = require('express');
const bodyParser                          = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const schema                              = require('./src/schema');

const { connectMongo }                    = require('./src/db/mongoose');
const { auth }                            = require('./src/auth');
const buildDataLoaders                    = require('./src/dataloaders');

const start = async () => {
    const mongo = await connectMongo();
    const app = express();
    const buildOptions = async (req, res) => {
        const user = await auth(req, mongo.Users);
        return {
            context: {
                dataloaders: buildDataLoaders(mongo),
                mongo,
                user
            }, // passed to all resolvers
            schema
        }
    }

    app.use(bodyParser.json());
    app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));

    app.use('/graphiql', graphiqlExpress({
        endpointURL: '/graphql',
        passHeader: `'Authorization': 'bearer token-victoraweb@gmail.com'`
    }))

    app.listen(3000, () => console.log(`Running on port ${3000}`));
};

start();

