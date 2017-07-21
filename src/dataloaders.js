const Dataloader = require('dataloader');

const batchUsers = async (Users, keys) => {
    return await Users.find({ _id: { $in: keys } }).toArray();
};

const userLoader = ({ Users }) => ({
    userLoader: new Dataloader(
        keys => batchUsers(Users, keys),
        { cacheKeyFn: key => key.toString() }
    )
});

module.exports = userLoader;