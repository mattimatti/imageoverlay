var fs = require('fs-extra');
var mkdirp = require('mkdirp');
var WatchFolder = require('./daemon/watchfolder.js');
var MediaConverter = require('./daemon/mediaconverter.js');
var Repo = require('./daemon/repo.js');
var path = require('path');

// Settings

var DEBUG = false;
var WIPE = false;




// get the current folder
var WORKFOLDER = path.join(process.cwd(), "./");

if (DEBUG) {
    WORKFOLDER = path.join(WORKFOLDER, "./test/");
}

// the paths

var TODO_PATH = WORKFOLDER + 'todo';
var DONE_PATH = WORKFOLDER + 'done';
var SAMPLE_PATH = WORKFOLDER + 'sample';


// show fancy

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
    if (process.argv[2] === 'wipe') {
        WIPE = true;
        console.log('');
        console.log('                 WIPE                   ');
        console.log('');
    }
}



// the total of files to be watched in order to start.
var TOTAL_FILES = 1;


// Instance the watchfolder
var wf = new WatchFolder(TODO_PATH, TOTAL_FILES);

// Instance the media converter
var mc;


// when the watcher is ready to run
wf.on('watcherReady', function() {

    console.log('WatchFolder:watcherReady');

    Repo.createEmptyDir(DONE_PATH);

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
    }


});



// When a new folder is ready

wf.on('folderIsReady', function(mypath, watcher) {

    console.log('folderIsReady: ' + mypath);

    if (watcher) {
        console.log('close watcher');
        watcher.close();
    }

    mc = new MediaConverter(WORKFOLDER,mypath);
    mc.on('converted', function() {
        // move the folder to done.

        console.log('');
        console.log('Move the folder to a processed location');
        console.log('');

        var done_mypath = mypath.replace('todo', 'done');

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


        });

    });

    mc.run();

});