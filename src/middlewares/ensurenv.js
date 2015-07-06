var fs = require('fs');
var settings = require('../../settings');

var ensureDir = function(rootDir, targetDir){
    var targetPath = rootDir +  '/' + targetDir;
    fs.readdir(targetPath, function(err,fileNameArray){
        if(err){
            fs.mkdir(targetPath, 0777);
        }
    });
};

module.exports = function(rootDir){
    ensureDir(rootDir, settings.file.public);
    ensureDir(rootDir, settings.file.build);
    ensureDir(rootDir, settings.file.components);
    ensureDir(rootDir, settings.file.upload);
    ensureDir(rootDir, settings.file.generated);
    ensureDir(rootDir, settings.file.generatedImages);
    ensureDir(rootDir, settings.file.generatedPhaseReport);
    ensureDir(rootDir, settings.file.score);
    ensureDir(rootDir, settings.file.scoreTemplate);
    ensureDir(rootDir, settings.file.scoreUploadArchive);
    ensureDir(rootDir, settings.file.appUserImage);
};