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
var config = require('config');


var MediaConverter = function(WORKFOLDER,path) {



    var watermarkPath = oPath.join(WORKFOLDER, config.get('watermark')) ;
    console.log(watermarkPath);


    EventEmitter.call(this);

    var watermarkImages = function() {

        var job = _.Deferred();

        var imagePath;
        glob(path + "/*.png", function(er, files) {
            imagePath = files[0];


            console.log('watermarkImages path: ' + imagePath);

            var parts = oPath.parse(imagePath);
            var imageDestPath = parts.dir + '/' + parts.name + '-done' + parts.ext;



            var onDone = function(error, stdout, stderr) {
                job.resolve();
            };


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