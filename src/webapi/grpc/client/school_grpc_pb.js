// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var school_pb = require('./school_pb.js');
var student_pb = require('./student_pb.js');
var teacher_pb = require('./teacher_pb.js');
var response_pb = require('./response_pb.js');

function serialize_Response(arg) {
  if (!(arg instanceof response_pb.Response)) {
    throw new Error('Expected argument of type Response');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_Response(buffer_arg) {
  return response_pb.Response.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_school_AddStudentsToTeacherRequest(arg) {
  if (!(arg instanceof school_pb.AddStudentsToTeacherRequest)) {
    throw new Error('Expected argument of type school.AddStudentsToTeacherRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_school_AddStudentsToTeacherRequest(buffer_arg) {
  return school_pb.AddStudentsToTeacherRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_school_RegisterRequest(arg) {
  if (!(arg instanceof school_pb.RegisterRequest)) {
    throw new Error('Expected argument of type school.RegisterRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_school_RegisterRequest(buffer_arg) {
  return school_pb.RegisterRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var SchoolService = exports.SchoolService = {
  register: {
    path: '/school.School/Register',
    requestStream: false,
    responseStream: false,
    requestType: school_pb.RegisterRequest,
    responseType: response_pb.Response,
    requestSerialize: serialize_school_RegisterRequest,
    requestDeserialize: deserialize_school_RegisterRequest,
    responseSerialize: serialize_Response,
    responseDeserialize: deserialize_Response,
  },
  addStudentsToTeacher: {
    path: '/school.School/AddStudentsToTeacher',
    requestStream: false,
    responseStream: false,
    requestType: school_pb.AddStudentsToTeacherRequest,
    responseType: response_pb.Response,
    requestSerialize: serialize_school_AddStudentsToTeacherRequest,
    requestDeserialize: deserialize_school_AddStudentsToTeacherRequest,
    responseSerialize: serialize_Response,
    responseDeserialize: deserialize_Response,
  },
};

exports.SchoolClient = grpc.makeGenericClientConstructor(SchoolService);
