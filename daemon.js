var fs = require('fs-extra');
var mkdirp = require('mkdirp');
var config = require('config');
var WatchFolder = require('./src/daemon/watchfolder.js');
var MediaConverter = require('./src/daemon/mediaconverter.js');
var Repo = require('./src/daemon/repo.js');
var path = require('path');

// Settings
var DEBUG = true;
var WIPE = false;

//var WORKFOLDER = config.get('workfolder');


var WORKFOLDER = path.join(__dirname, "./test/");


var TODO_PATH = WORKFOLDER + 'todo';
var DONE_PATH = WORKFOLDER + 'done';
var SAMPLE_PATH = WORKFOLDER + 'sample';


console.log('==============================================');
console.log('');
console.log('');
console.log('           IMGOVERLAY START                   ');
console.log('');
console.log('');
console.log('==============================================');





// Command line params
if (process.argv[2]) {

    DEBUG = true;
    if (process.argv[2] == 'wipe') {
        WIPE = true;
console.log('');
console.log('                 WIPE                   ');
console.log('');
    }
}





// the total of files to be processed.
var TOTAL_FILES = 1;


// Instance the watchfolder
var wf = new WatchFolder(TODO_PATH, TOTAL_FILES);

// Instance the media converter
var mc;


// when the watcher is ready to run
wf.on('watcherReady', function() {

    console.log('watcherReady');

    // only if debug is active we cleanup the dropbox folders
    if (DEBUG) {
        if (WIPE) {
            Repo.cleanTodo(TODO_PATH, function() {
                console.log('cleaned ' + TODO_PATH + ' mypath!');
                Repo.cleanDone(DONE_PATH, function() {
                    console.log('cleaned ' + DONE_PATH + ' mypath!');
                    Repo.createDir(TODO_PATH, SAMPLE_PATH);
                });
            });

        } else {
            Repo.createDir(TODO_PATH, SAMPLE_PATH);
            Repo.createDir(DONE_PATH, SAMPLE_PATH);
        }

    }

});



// When a new folder is ready

wf.on('folderIsReady', function(mypath, watcher) {

    console.log('folderIsReady: ' + mypath);

    if (watcher) {
        console.log('close watcher');
        watcher.close();
    }

    mc = new MediaConverter(mypath);
    mc.on('converted', function() {
        // move the folder to done.

        console.log('');
        console.log('Move the folder to a processed location');
        console.log('');

        var done_mypath = mypath.replace('todo','done');

        console.log('done_mypath ' + done_mypath);
        console.log('mypath ' + mypath);

        // Move the folder to processed location
        fs.move(mypath, done_mypath, function(err) {
            if (err) {
            	console.error(err);
                return;
            }

            console.log('');
            console.log('Folder has been copied to ' + done_mypath);
            console.log('');

            process.exit();

        });

    });

    mc.run();

});
