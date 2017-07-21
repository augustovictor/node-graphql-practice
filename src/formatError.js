const { formatError } = require('graphql');

const error = error => {
    const data = formatError(error);
    const { originalError } = error;
    data.field = originalError && originalError.field;
    return data;
};

module.exports = error;