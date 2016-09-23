var nexe = require('nexe');

nexe.compile({
    input: './daemon.js', // where the input file is
    output: './daemon.exe', // where to output the compiled binary
    nodeVersion: '4.4.7', // node version
    nodeTempDir: 'src', // where to store node source.
    nodeVCBuildArgs: ["nosign", "x64"], // when you want to control the make process for windows.
                                        // By default "nosign" option will be specified
                                        // You can check all available options and its default values here:
                                        // https://github.com/nodejs/node/blob/master/vcbuild.bat

}, function(err) {
    if(err) {
        return console.log(err);
    }

     // do whatever
});