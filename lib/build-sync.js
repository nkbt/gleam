"use strict";

var path = require('path');
var _ = require('underscore');
var fs = require('fs');
var glob = require('glob');
var mkdirp = require('mkdirp');


function getPaths(root) {
	var files = {
		'from-json': {
			template: path.join(__dirname, 'browser', 'from-json.txt')
		},
		'abstract': {
			template: path.join(__dirname, 'browser', 'abstract.txt'),
			content: path.join(__dirname, 'abstract.js')
		}
	};
	glob.sync("**/*.js", {cwd: root}).forEach(function (entityPath) {
		files[entityPath.replace('.js', '')] = {
			template: path.join(__dirname, 'browser', 'entity.txt'),
			content: path.join(root, entityPath)
		};
	});
	return files;
}


var removeStrictRegexp = new RegExp('\\s*[\'"]use strict[\'"];\\s*', 'ig');


function renderFile(namespace, file, out) {
	var template = _.template(fs.readFileSync(file.template, 'UTF-8')),
		content = template({
			namespace: namespace,
			content: file.content && fs.readFileSync(file.content, 'UTF-8').replace(removeStrictRegexp, '') || ''
		}),
		outDir = path.join(out, path.join.apply(path, _.initial(namespace.split('/')))),
		outFile = path.join(out, namespace + '.js');

	mkdirp.sync(outDir);
	fs.writeFileSync(outFile, content);
	return true;
}


function render(files, out) {
	return _.reduce(files, function (memo, file, namespace) {
		return memo && renderFile(namespace, file, out);
	}, true);
}


function build(root) {
	return function (out) {
		return render(getPaths(root), out);
	};
}

module.exports = exports = build;
