// encode a sequence of images into an animated gif


// https://github.com/SleepProgger/my_ffmpeg_utils/blob/master/video2gif.bat

var fs = require('fs-extra');
var glob = require('glob');
var exec = require('child_process').exec;
var fileExists = require('file-exists');
var oPath = require('path');
var util = require('util');
var _ = require('underscore');
_.mixin(require('underscore.deferred'));
var events = require('events');
var EventEmitter = events.EventEmitter;
var _s = require("underscore.string");
_.mixin(_s.exports());
var sharp = require('sharp');


var MediaConverter = function(path) {

    var startImage, endImage, watermarkedCount;

    EventEmitter.call(this);

    var watermarkImages = function() {


        watermarkedCount = 2;
        console.log('watermarkImages path: ' + path);

        var job = _.Deferred();

        var _innerAction = function() {

            var imageName;

            var i;
            var x = 1;

            var onDone = function(error, stdout, stderr) {
                if (!error) {

                    x++;

                    console.log('applied watermark to ' + imageName);

                    if (x === watermarkedCount) {
                        job.resolve();
                    }


                } else {
                    console.error(error);
                }
            };

            for (i = 1; i < watermarkedCount; i++) {
                imageName = 'foto' + i + '.jpg';
                var imagePath = path + '/' + imageName;
                var imageDestPath = imagePath.replace('.jpg','-done.jpg');

				sharp(imagePath)
				  .resize(480, 480)
				  .overlayWith(path + '/../../hashtag.png', { gravity: sharp.gravity.center } )
				  .toFile(imageDestPath, onDone);
            }



        };

        _innerAction();
        return job;
    };




    // This is is the entry point for the conversion
    // you can override the inner behaviour 
    // in future implementations

    this.run = function() {
        var me = this;
        watermarkImages().done(function() {

            // Say yeah touch your nose! you got it!
            console.log('');
            console.log('ended all the conversion processes');
            console.log('');

            // Emit event the folder is ready
            me.emit('converted');

        });
    };
};


util.inherits(MediaConverter, EventEmitter);

module.exports = MediaConverter;
