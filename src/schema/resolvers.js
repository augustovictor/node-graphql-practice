const links = [
    {
        id: 1,
        url: 'http://graphql.org/',
        description: 'The Best Query Language'
    },
    {
        id: 2,
        url: 'http://dev.apollodata.com',
        description: 'Awesome GraphQL Client'
    },
];

const allLinks = () => links;

const createLink = (_, data) => {
    const newLink = Object.assign({ id: links.length + 1}, data);
    links.push(newLink);
    return newLink;
}

module.exports = {
    Query   : { allLinks },
    Mutation: { createLink }
};