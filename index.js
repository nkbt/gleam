module.exports = process.env.GLEAM_COV ? require('./lib-cov/gleam') : require('./lib/gleam');
