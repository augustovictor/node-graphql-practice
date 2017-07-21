const id = root => root._id || root.id;

const allLinks = async (root, data, { mongo: { Links } }) => {
    return await Links.find({}).toArray();
};

const createLink = async (root, data, { mongo: { Links } }) => {
    const response = await Links.insert(data);
    return Object.assign({ id: response.insertedIds[0] }, data);
};

const allUsers = async (root, data, { mongo: { Users } }) => {
    return await Users.find({}).toArray();
};

const createUser = async (root, data, { mongo: { Users } }) => {
    const newUser = {
        name: data.name,
        email: data.authProvider.email.email,
        password: data.authProvider.email.password
    };

    const response = await Users.insert(newUser);
    return Object.assign({ id: response.insertedIds[0] }, newUser);
};

module.exports = {
    Query   : { allLinks, allUsers },
    Mutation: { createLink, createUser },
    Link: { id },
    User: { id }
};