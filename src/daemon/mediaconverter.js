var fs = require('fs-extra');
var glob = require('glob');
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


var MediaConverter = function(WORKFOLDER, path, watermarkPath) {



    console.log('MediaConverter');
    console.log(arguments);

    var pattern = path + "/*(*.png|*.jpg|*.jpeg|*.gif)";

    console.log('pattern ' + pattern);


    EventEmitter.call(this);

    var watermarkImages = function() {

        var job = _.Deferred();

         var onDone = function(error, stdout, stderr) {
                job.resolve();
            };

        var imagePath;
        glob(pattern, function(er, files) {

            console.log('globbed files');
            console.log(arguments);

            if (files.length <= 0) {
                console.error('no files found');
                job.reject();
                return;
            }

            imagePath = files[0];


            console.log('watermarkImages path: ' + imagePath);

            var parts = oPath.parse(imagePath);
            var imageDestPath = parts.dir + '/' + parts.name + '-done' + parts.ext;


            sharp(imagePath)
                .overlayWith(watermarkPath, {
                    gravity: sharp.gravity.center
                })
                .toFile(imageDestPath, onDone);

        });



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