module.exports = process.env.GLEAM_COV ? require('./lib-cov') : require('./lib');
