///////// USEFUL FUNCTIONS FOR DEBUG ///////////////


var fs = require('fs-extra');
var uuid = require('node-uuid');


function cleanDone(DONE_PATH, cb) {
	if (!cb) {
		cb = function(err) {
			console.log('cleaned ' + DONE_PATH + ' path!');
		};
	}
	fs.emptyDir(DONE_PATH, cb);
}



function cleanTodo(TODO_PATH, cb) {
	if (!cb) {
		cb = function(err) {
			console.log('cleaned ' + TODO_PATH + ' path!');
		};
	}

	fs.emptyDir(TODO_PATH, cb);
}


function createEmptyDir(TODO_PATH) {
fs.mkdirs(TODO_PATH, function() {});
}


function createDir(TODO_PATH, SAMPLE_PATH) {


	var guid = uuid.v4();


	cleanTodo(TODO_PATH, function(err) {

		var fldr_path = TODO_PATH + '\\' + guid;

		fs.mkdirs(fldr_path, function() {

if(SAMPLE_PATH){
			fs.copy(SAMPLE_PATH, fldr_path, function(err) {
				
				if (err) {
					return console.error(err);
				}

				console.log('successfully copied to ' + fldr_path);
			});

			}

		});

	});
}



module.exports = {
	cleanDone: cleanDone,
	cleanTodo: cleanTodo,
	createDir: createDir,
	createEmptyDir: createEmptyDir
};