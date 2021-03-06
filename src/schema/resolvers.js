const { ObjectID } = require('mongodb');
const { URL } = require('url');
const { ValidationError } = require('../ValidationError');

// SHARED
const id = root => root._id || root.id;

// LINKS
const assertValidLink = ({ url }) => {
    try {
        new URL(url);
    } catch(err) {
        throw new ValidationError('Link validation error: invalid url', 'url');
    }
}

const link = {
    id,
    postedBy: async ({ postedById }, data, { dataloaders: { userLoader } }) => {
        return await userLoader.load(postedById);
    },
    votes: async ({ _id }, data, { mongo: { Votes } }) => {
        return await Votes.find({ linkId: _id }).toArray();
    }
};

const allLinks = async (root, data, { mongo: { Links } }) => {
    return await Links.find({}).toArray();
};

const createLink = async (root, data, { mongo: { Links }, user }) => {
    assertValidLink(data);
    const newLink = Object.assign({ postedById: user && user._id }, data);
    const response = await Links.insert(newLink);
    return Object.assign({ id: response.insertedIds[0] }, newLink);
};

// USERS
const user = {
    id,
    votes: async ({ _id }, data, { mongo: { Votes } }) => {
        return await Votes.find({ userId: _id }).toArray();
    }
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

// VOTES
const vote = {
    id,
    user: async ({ userId }, data, { dataloaders: { userLoader } }) => {
        return await userLoader.load(userId);
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
    User: user,
    Vote: vote
};