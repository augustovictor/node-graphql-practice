const id = root => root._id || root.id;

const link = {
    id,
    postedBy: async ({ postedById }, data, { mongo: { Users } }) => {
        return await Users.findOne({ _id: postedById });
    }
};

const allLinks = async (root, data, { mongo: { Links } }) => {
    return await Links.find({}).toArray();
};

const createLink = async (root, data, { mongo: { Links }, user }) => {
    const newLink = Object.assign({ postedById: user && user._id }, data);
    const response = await Links.insert(newLink);
    return Object.assign({ id: response.insertedIds[0] }, newLink);
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

const signinUser = async (root, data, { mongo: { Users } }) => {
    const { email } = data.email;
    const user = await Users.findOne({ email });
    if (data.email.password === user.password) {
        return { token: `token-${user.email}`, user };
    }
};

module.exports = {
    Query   : { allLinks, allUsers },
    Mutation: { createLink, createUser, signinUser },
    Link: link,
    User: { id }
};