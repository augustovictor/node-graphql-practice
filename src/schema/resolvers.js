const id = root => root._id || root.id;

const allLinks = async (root, data, { mongo: { Links } }) => {
    return await Links.find({}).toArray();
};

const createLink = async (root, data, { mongo: { Links } }) => {
    const response = await Links.insert(data);
    return Object.assign({ id: response.insertedIds[0] }, data);
};

module.exports = {
    Query   : { allLinks },
    Mutation: { createLink },
    Link: { id }
};