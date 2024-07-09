// source: school.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = (function() {
  if (this) { return this; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  if (typeof self !== 'undefined') { return self; }
  return Function('return this')();
}.call(null));

var student_pb = require('./student_pb.js');
goog.object.extend(proto, student_pb);
var teacher_pb = require('./teacher_pb.js');
goog.object.extend(proto, teacher_pb);
var response_pb = require('./response_pb.js');
goog.object.extend(proto, response_pb);
goog.exportSymbol('proto.school.AddStudentsToTeacherRequest', null, global);
goog.exportSymbol('proto.school.CommonStudentsRequest', null, global);
goog.exportSymbol('proto.school.CommonStudentsResponse', null, global);
goog.exportSymbol('proto.school.RegisterRequest', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.school.RegisterRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.school.RegisterRequest.repeatedFields_, null);
};
goog.inherits(proto.school.RegisterRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.school.RegisterRequest.displayName = 'proto.school.RegisterRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.school.AddStudentsToTeacherRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.school.AddStudentsToTeacherRequest.repeatedFields_, null);
};
goog.inherits(proto.school.AddStudentsToTeacherRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.school.AddStudentsToTeacherRequest.displayName = 'proto.school.AddStudentsToTeacherRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.school.CommonStudentsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.school.CommonStudentsRequest.repeatedFields_, null);
};
goog.inherits(proto.school.CommonStudentsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.school.CommonStudentsRequest.displayName = 'proto.school.CommonStudentsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.school.CommonStudentsResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.school.CommonStudentsResponse.repeatedFields_, null);
};
goog.inherits(proto.school.CommonStudentsResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.school.CommonStudentsResponse.displayName = 'proto.school.CommonStudentsResponse';
}

/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.school.RegisterRequest.repeatedFields_ = [1,2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.school.RegisterRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.school.RegisterRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.school.RegisterRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.school.RegisterRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    teachersList: jspb.Message.toObjectList(msg.getTeachersList(),
    teacher_pb.Teacher.toObject, includeInstance),
    studentsList: jspb.Message.toObjectList(msg.getStudentsList(),
    student_pb.Student.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.school.RegisterRequest}
 */
proto.school.RegisterRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.school.RegisterRequest;
  return proto.school.RegisterRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.school.RegisterRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.school.RegisterRequest}
 */
proto.school.RegisterRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new teacher_pb.Teacher;
      reader.readMessage(value,teacher_pb.Teacher.deserializeBinaryFromReader);
      msg.addTeachers(value);
      break;
    case 2:
      var value = new student_pb.Student;
      reader.readMessage(value,student_pb.Student.deserializeBinaryFromReader);
      msg.addStudents(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.school.RegisterRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.school.RegisterRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.school.RegisterRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.school.RegisterRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTeachersList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      teacher_pb.Teacher.serializeBinaryToWriter
    );
  }
  f = message.getStudentsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      student_pb.Student.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Teacher teachers = 1;
 * @return {!Array<!proto.school.Teacher>}
 */
proto.school.RegisterRequest.prototype.getTeachersList = function() {
  return /** @type{!Array<!proto.school.Teacher>} */ (
    jspb.Message.getRepeatedWrapperField(this, teacher_pb.Teacher, 1));
};


/**
 * @param {!Array<!proto.school.Teacher>} value
 * @return {!proto.school.RegisterRequest} returns this
*/
proto.school.RegisterRequest.prototype.setTeachersList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.school.Teacher=} opt_value
 * @param {number=} opt_index
 * @return {!proto.school.Teacher}
 */
proto.school.RegisterRequest.prototype.addTeachers = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.school.Teacher, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.school.RegisterRequest} returns this
 */
proto.school.RegisterRequest.prototype.clearTeachersList = function() {
  return this.setTeachersList([]);
};


/**
 * repeated Student students = 2;
 * @return {!Array<!proto.school.Student>}
 */
proto.school.RegisterRequest.prototype.getStudentsList = function() {
  return /** @type{!Array<!proto.school.Student>} */ (
    jspb.Message.getRepeatedWrapperField(this, student_pb.Student, 2));
};


/**
 * @param {!Array<!proto.school.Student>} value
 * @return {!proto.school.RegisterRequest} returns this
*/
proto.school.RegisterRequest.prototype.setStudentsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.school.Student=} opt_value
 * @param {number=} opt_index
 * @return {!proto.school.Student}
 */
proto.school.RegisterRequest.prototype.addStudents = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.school.Student, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.school.RegisterRequest} returns this
 */
proto.school.RegisterRequest.prototype.clearStudentsList = function() {
  return this.setStudentsList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.school.AddStudentsToTeacherRequest.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.school.AddStudentsToTeacherRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.school.AddStudentsToTeacherRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.school.AddStudentsToTeacherRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.school.AddStudentsToTeacherRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    teacher: (f = msg.getTeacher()) && teacher_pb.Teacher.toObject(includeInstance, f),
    studentsList: (f = jspb.Message.getRepeatedField(msg, 2)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.school.AddStudentsToTeacherRequest}
 */
proto.school.AddStudentsToTeacherRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.school.AddStudentsToTeacherRequest;
  return proto.school.AddStudentsToTeacherRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.school.AddStudentsToTeacherRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.school.AddStudentsToTeacherRequest}
 */
proto.school.AddStudentsToTeacherRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new teacher_pb.Teacher;
      reader.readMessage(value,teacher_pb.Teacher.deserializeBinaryFromReader);
      msg.setTeacher(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.addStudents(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.school.AddStudentsToTeacherRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.school.AddStudentsToTeacherRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.school.AddStudentsToTeacherRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.school.AddStudentsToTeacherRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTeacher();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      teacher_pb.Teacher.serializeBinaryToWriter
    );
  }
  f = message.getStudentsList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      2,
      f
    );
  }
};


/**
 * optional Teacher teacher = 1;
 * @return {?proto.school.Teacher}
 */
proto.school.AddStudentsToTeacherRequest.prototype.getTeacher = function() {
  return /** @type{?proto.school.Teacher} */ (
    jspb.Message.getWrapperField(this, teacher_pb.Teacher, 1));
};


/**
 * @param {?proto.school.Teacher|undefined} value
 * @return {!proto.school.AddStudentsToTeacherRequest} returns this
*/
proto.school.AddStudentsToTeacherRequest.prototype.setTeacher = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.school.AddStudentsToTeacherRequest} returns this
 */
proto.school.AddStudentsToTeacherRequest.prototype.clearTeacher = function() {
  return this.setTeacher(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.school.AddStudentsToTeacherRequest.prototype.hasTeacher = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * repeated string students = 2;
 * @return {!Array<string>}
 */
proto.school.AddStudentsToTeacherRequest.prototype.getStudentsList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 2));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.school.AddStudentsToTeacherRequest} returns this
 */
proto.school.AddStudentsToTeacherRequest.prototype.setStudentsList = function(value) {
  return jspb.Message.setField(this, 2, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.school.AddStudentsToTeacherRequest} returns this
 */
proto.school.AddStudentsToTeacherRequest.prototype.addStudents = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.school.AddStudentsToTeacherRequest} returns this
 */
proto.school.AddStudentsToTeacherRequest.prototype.clearStudentsList = function() {
  return this.setStudentsList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.school.CommonStudentsRequest.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.school.CommonStudentsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.school.CommonStudentsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.school.CommonStudentsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.school.CommonStudentsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    teachersList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.school.CommonStudentsRequest}
 */
proto.school.CommonStudentsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.school.CommonStudentsRequest;
  return proto.school.CommonStudentsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.school.CommonStudentsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.school.CommonStudentsRequest}
 */
proto.school.CommonStudentsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.addTeachers(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.school.CommonStudentsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.school.CommonStudentsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.school.CommonStudentsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.school.CommonStudentsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTeachersList();
  if (f.length > 0) {
    writer.writeRepeatedString(
      1,
      f
    );
  }
};


/**
 * repeated string teachers = 1;
 * @return {!Array<string>}
 */
proto.school.CommonStudentsRequest.prototype.getTeachersList = function() {
  return /** @type {!Array<string>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<string>} value
 * @return {!proto.school.CommonStudentsRequest} returns this
 */
proto.school.CommonStudentsRequest.prototype.setTeachersList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {string} value
 * @param {number=} opt_index
 * @return {!proto.school.CommonStudentsRequest} returns this
 */
proto.school.CommonStudentsRequest.prototype.addTeachers = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.school.CommonStudentsRequest} returns this
 */
proto.school.CommonStudentsRequest.prototype.clearTeachersList = function() {
  return this.setTeachersList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.school.CommonStudentsResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.school.CommonStudentsResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.school.CommonStudentsResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.school.CommonStudentsResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.school.CommonStudentsResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    studentsList: jspb.Message.toObjectList(msg.getStudentsList(),
    student_pb.Student.toObject, includeInstance),
    response: (f = msg.getResponse()) && response_pb.Response.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.school.CommonStudentsResponse}
 */
proto.school.CommonStudentsResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.school.CommonStudentsResponse;
  return proto.school.CommonStudentsResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.school.CommonStudentsResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.school.CommonStudentsResponse}
 */
proto.school.CommonStudentsResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new student_pb.Student;
      reader.readMessage(value,student_pb.Student.deserializeBinaryFromReader);
      msg.addStudents(value);
      break;
    case 2:
      var value = new response_pb.Response;
      reader.readMessage(value,response_pb.Response.deserializeBinaryFromReader);
      msg.setResponse(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.school.CommonStudentsResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.school.CommonStudentsResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.school.CommonStudentsResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.school.CommonStudentsResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getStudentsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      student_pb.Student.serializeBinaryToWriter
    );
  }
  f = message.getResponse();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      response_pb.Response.serializeBinaryToWriter
    );
  }
};


/**
 * repeated Student students = 1;
 * @return {!Array<!proto.school.Student>}
 */
proto.school.CommonStudentsResponse.prototype.getStudentsList = function() {
  return /** @type{!Array<!proto.school.Student>} */ (
    jspb.Message.getRepeatedWrapperField(this, student_pb.Student, 1));
};


/**
 * @param {!Array<!proto.school.Student>} value
 * @return {!proto.school.CommonStudentsResponse} returns this
*/
proto.school.CommonStudentsResponse.prototype.setStudentsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.school.Student=} opt_value
 * @param {number=} opt_index
 * @return {!proto.school.Student}
 */
proto.school.CommonStudentsResponse.prototype.addStudents = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.school.Student, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.school.CommonStudentsResponse} returns this
 */
proto.school.CommonStudentsResponse.prototype.clearStudentsList = function() {
  return this.setStudentsList([]);
};


/**
 * optional Response response = 2;
 * @return {?proto.Response}
 */
proto.school.CommonStudentsResponse.prototype.getResponse = function() {
  return /** @type{?proto.Response} */ (
    jspb.Message.getWrapperField(this, response_pb.Response, 2));
};


/**
 * @param {?proto.Response|undefined} value
 * @return {!proto.school.CommonStudentsResponse} returns this
*/
proto.school.CommonStudentsResponse.prototype.setResponse = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.school.CommonStudentsResponse} returns this
 */
proto.school.CommonStudentsResponse.prototype.clearResponse = function() {
  return this.setResponse(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.school.CommonStudentsResponse.prototype.hasResponse = function() {
  return jspb.Message.getField(this, 2) != null;
};


goog.object.extend(exports, proto.school);
