var PROTO_PATH = __dirname + 'Protos/school.proto';
import fs from "fs";
//import parseArgs from 'minimist';
import path from 'path';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
// Suggested options for similarity to existing grpc.load behavior
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
var protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
// The protoDescriptor object has the full package hierarchy
var school = protoDescriptor.school;
/**
 * Get a feature object at the given point, or creates one if it does not exist.
 * @param {point} point The point to check
 * @return {feature} The feature object at the point. Note that an empty name
 *     indicates no feature
 */
function register (registration) {
    var feature;
    // Check if there is already a feature object for the given point
    for (var i = 0; i < feature_list.length; i++) {
        feature = feature_list[i];
        if (feature.location.latitude === point.latitude &&
            feature.location.longitude === point.longitude) {
            return feature;
        }
    }
    var name = '';
    feature = {
        name: name,
        location: point
    };
    return feature;
}
/**
 * register request handler. Gets a request with a point, and responds with a
 * feature object indicating whether there is a feature at that point.
 * @param {EventEmitter} call Call object for the handler to process
 * @param {function(Error, feature)} callback Response callback
 */
function register (call, callback) {
    callback(null, checkFeature(call.request));
}
/**
 * Get a new server with the handler functions in this file bound to the methods
 * it serves.
 * @return {Server} The new server object
 */
function getServer () {
    var server = new grpc.Server();
    server.addService(school.School.service, {
        register: register,
        addStudentsToTeacher: addStudentsToTeacher,
    });
    return server;
}

if (require.main === module) {
    // If this is run as a script, start a server on an unused port
    var routeServer = getServer();
    routeServer.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        var argv = parseArgs(process.argv, {
            string: 'db_path'
        });
        fs.readFile(path.resolve(argv.db_path), function (err, data) {
            if (err) throw err;
            feature_list = JSON.parse(data);
            routeServer.start();
        });
    });
}

exports.getServer = getServer;