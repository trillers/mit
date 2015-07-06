var logger = require('../app/logging').logger;
var u = require('../app/util');
var Image = require('../models/Image').model;
var Service = {};

Service.load = function (id, callback) {
    Image
        .findById(id)
        .populate('crtBy')
        .lean(true).exec(function (err, doc) {
        if (err) {
            logger.error('Fail to load image [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to load image [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.create = function (json, callback) {
    var doc = new Image(json);
    doc.save(function (err, doc, numberAffected) {
        if (err) {
            if (callback) callback(err);
            return;
        }
        if (numberAffected) {
            logger.debug('Succeed to create image: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(null, doc);
        }
        else {
            logger.error('Fail to create image: ' + require('util').inspect(doc) + '\r\n');
            if (callback) callback(new Error('Fail to create image'));
        }
    });
};

Service.delete = function (id, callback) {
    Image.findByIdAndRemove(id, function (err, doc) {
        if (err) {
            logger.error('Fail to delete image [id=' + id + ']: ' + err);
            if (callback) callback(err);
            return;
        }

        logger.debug('Succeed to delete image [id=' + id + ']');
        if (callback) callback(null, doc);
    });
};

Service.update = function (id, update, callback) {
    delete update._id;
    Image.findOneAndUpdate({_id: id}, update, function(err, doc){
        if (err) {
            if (callback) callback(err);
            return;
        }
        logger.debug('Succeed to update image: ' + require('util').inspect(doc) + '\r\n');
        if (callback) callback(null, doc);
    });
    //Image.findById(id, function (err, doc) {
    //    if (err) {
    //        logger.error('Fail to update image [id=' + id + ']: ' + err);
    //        if (callback) callback(err);
    //        return;
    //    }
    //    if (doc) {
    //        u.extend(doc, update);
    //        doc.increment(); //TODO: do it in pre-save event
    //        doc.save(function (err, result, numberAffected) {
    //            if (err) {
    //                if (callback) callback(err);
    //                return;
    //            }
    //            if (numberAffected) {
    //                logger.debug('Succeed to update image: ' + require('util').inspect(result) + '\r\n');
    //                if (callback) callback(null, result);
    //            }
    //            else {
    //                var errMsg = 'Fail to update image [id=' + id + '] with ' + require('util').inspect(update) + '\r\n';
    //                logger.error(errMsg);
    //                if (callback) callback(new Error(errMsg));
    //            }
    //        });
    //    }
    //    else {
    //        logger.debug('Fail to update image [id=' + id + '] because it does not exist');
    //        if (callback) callback(null, null);
    //    }
    //
    //});
};


module.exports = Service;
