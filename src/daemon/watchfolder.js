var chokidar = require('chokidar'); // the watchfolder

var fs = require('fs-extra');
var oPath = require('path');
var _ = require('underscore');
var events = require('events');
var EventEmitter = events.EventEmitter;
var util = require('util');
var crypto = require('crypto');
var fileExists = require('file-exists');

var WatchFolder = function(DROPBOX_PATH, TOTAL_FILES) {

	EventEmitter.call(this);


	var watcherOpts = {
		ignored: /[\/\\]\./,
		ignoreInitial: false,
		persistent: true,
		awaitWriteFinish: true,
		usePolling: true,
		depth: 0
	};


	this.watcher = null;

	var me = this;

	var newWatcher = null;

	// Collection of watchers
	var tempWatchers = [];


	// Initialize watcher.
	me.watcher = chokidar.watch(DROPBOX_PATH, watcherOpts);

	console.log('inited chokidar watcher on folder ' + DROPBOX_PATH);


	// async version with basic error handling
	function walk(currentDirPath, callback) {
		fs.readdir(currentDirPath, function(err, files) {
			if (err) {
				throw new Error(err);
			}
			files.forEach(function(name) {
				var filePath = oPath.join(currentDirPath, name);
				var stat = fs.statSync(filePath);
				if (stat.isFile()) {
					callback(filePath, stat);
				} else if (stat.isDirectory()) {
					walk(filePath, callback);
				}
			});
		});
	}

	function walkSync(currentDirPath, callback) {
		var fs = require('fs'),
			path = require('path');
		fs.readdirSync(currentDirPath).forEach(function(name) {
			var filePath = oPath.join(currentDirPath, name);
			var stat = fs.statSync(filePath);
			if (stat.isFile()) {
				callback(filePath, stat);
			} else if (stat.isDirectory()) {
				walkSync(filePath, callback);
			}
		});
	}

	// check 
	function checkFolderUploadComplete(path, newWatcher) {
		console.log('checkFolderUploadComplete ' + path);

		newWatcher.files = newWatcher.files || [];

		walkSync(path, function(filePath, stat) {
			//console.log('walked ' + filePath);
			newWatcher.files.push(filePath);
			newWatcher.files = _.uniq(newWatcher.files);
		});

		console.log('We have ' + newWatcher.files.length + ' files');

		// check for completeness
		if (newWatcher.files.length >= TOTAL_FILES) {

			console.log('reached amount of ' + TOTAL_FILES + ' files');


			// check if metadata file exists

			//if (fileExists(path + '/metadata.txt')) {

			console.log('metadata file exists');

			newWatcher.close();

			tempWatchers = _.without(tempWatchers, newWatcher);


			console.log('tempWatchers length ' + tempWatchers.length);

			// emit event the folder is ready
			me.emit('folderIsReady', path);



			//}



		}

	}



	function createSubWatcher(path) {

		console.log(' create subwatcher on path ' + path);

		// create a watcher that checks all the files are loaded.
		newWatcher = chokidar.watch(path, watcherOpts);

		// assign an id to the watcher
		newWatcher.id = crypto.createHash('md5').update(path).digest("hex");

		// once added
		newWatcher.on('add', function(arg1) {
			//console.log('added image' + arg1);
			checkFolderUploadComplete(path, newWatcher);
		});

		newWatcher.on('change', function(path, stats) {
			if (stats) {
				console.log(`File ${path} changed size to ${stats.size}`);
			}
		});


		// check when we have all the files loaded
		tempWatchers.push(newWatcher);


	}



	function onAddDir(path) {

		if (path === '') {
			console.error('onAddDir no pat');
			return;
		}


		console.log('');
		console.log('');
		console.log('');
		console.log('');
		console.log('====================');
		console.log('onAddDir ' + path);
		console.log('====================');
		console.log('');
		console.log('');
		console.log('');
		console.log('');

		createSubWatcher(path);

	}


	// 
	function onReady() {
		console.log('chokidar is ready');
		me.watcher.on('addDir', _.bind(onAddDir, me));

		// emit event the folder is ready
		me.emit('watcherReady');
	}


	// When a directory is added to the dropbox folder
	this.watcher.on('ready', _.bind(onReady, this));

	this.watcher.on('all', function(e, path) {
		console.log(e, path);
	});



};


util.inherits(WatchFolder, EventEmitter);


module.exports = WatchFolder;