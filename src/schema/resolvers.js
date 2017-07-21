const { ObjectID } = require('mongodb');

// SHARED
const id = root => root._id || root.id;

// LINKS
const link = {
    id,
    postedBy: async ({ postedById }, data, { mongo: { Users } }) => {
        return await Users.findOne({ _id: postedById });
    },
    votes: async ({ _id }, data, { mongo: { Votes } }) => {
        return await Votes.find({ linkId: _id }).toArray();
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

// USERS
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

// VOTES
const vote = {
    id,
    user: async ({ userId }, data, { mongo: { Users } }) => {
        return await Users.findOne({ _id: userId });
    },
    link: async ({ linkId }, data, { mongo: { Links } }) => {
        return await Links.findOne({ _id: linkId });
    }
}

const createVote = async (root, data, { mongo: { Votes }, user }) => {
    const newVote = {
        userId: user && user._id,
        linkId: new ObjectID(data.linkId)
    };
    const response = await Votes.insert(newVote);
    return Object.assign({ id: response.insertedIds[0] }, newVote);
};

module.exports = {
    Query   : { allLinks, allUsers },
    Mutation: { createLink, createUser, signinUser, createVote },
    Link: link,
    User: { id },
    Vote: vote
};