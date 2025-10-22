// package: school
// file: school.proto

import * as jspb from "google-protobuf";
import * as student_pb from "./student_pb";
import * as teacher_pb from "./teacher_pb";
import * as response_pb from "./response_pb";

export class RegisterRequest extends jspb.Message {
  clearTeachersList(): void;
  getTeachersList(): Array<teacher_pb.Teacher>;
  setTeachersList(value: Array<teacher_pb.Teacher>): void;
  addTeachers(value?: teacher_pb.Teacher, index?: number): teacher_pb.Teacher;

  clearStudentsList(): void;
  getStudentsList(): Array<student_pb.Student>;
  setStudentsList(value: Array<student_pb.Student>): void;
  addStudents(value?: student_pb.Student, index?: number): student_pb.Student;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterRequest): RegisterRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RegisterRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterRequest;
  static deserializeBinaryFromReader(message: RegisterRequest, reader: jspb.BinaryReader): RegisterRequest;
}

export namespace RegisterRequest {
  export type AsObject = {
    teachersList: Array<teacher_pb.Teacher.AsObject>,
    studentsList: Array<student_pb.Student.AsObject>,
  }
}

export class AddStudentsToTeacherRequest extends jspb.Message {
  hasTeacher(): boolean;
  clearTeacher(): void;
  getTeacher(): teacher_pb.Teacher | undefined;
  setTeacher(value?: teacher_pb.Teacher): void;

  clearStudentsList(): void;
  getStudentsList(): Array<string>;
  setStudentsList(value: Array<string>): void;
  addStudents(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddStudentsToTeacherRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddStudentsToTeacherRequest): AddStudentsToTeacherRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AddStudentsToTeacherRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddStudentsToTeacherRequest;
  static deserializeBinaryFromReader(message: AddStudentsToTeacherRequest, reader: jspb.BinaryReader): AddStudentsToTeacherRequest;
}

export namespace AddStudentsToTeacherRequest {
  export type AsObject = {
    teacher?: teacher_pb.Teacher.AsObject,
    studentsList: Array<string>,
  }
}

export class CommonStudentsRequest extends jspb.Message {
  clearTeachersList(): void;
  getTeachersList(): Array<string>;
  setTeachersList(value: Array<string>): void;
  addTeachers(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommonStudentsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CommonStudentsRequest): CommonStudentsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CommonStudentsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommonStudentsRequest;
  static deserializeBinaryFromReader(message: CommonStudentsRequest, reader: jspb.BinaryReader): CommonStudentsRequest;
}

export namespace CommonStudentsRequest {
  export type AsObject = {
    teachersList: Array<string>,
  }
}

export class CommonStudentsResponse extends jspb.Message {
  clearStudentsList(): void;
  getStudentsList(): Array<student_pb.Student>;
  setStudentsList(value: Array<student_pb.Student>): void;
  addStudents(value?: student_pb.Student, index?: number): student_pb.Student;

  hasResponse(): boolean;
  clearResponse(): void;
  getResponse(): response_pb.Response | undefined;
  setResponse(value?: response_pb.Response): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommonStudentsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CommonStudentsResponse): CommonStudentsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CommonStudentsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommonStudentsResponse;
  static deserializeBinaryFromReader(message: CommonStudentsResponse, reader: jspb.BinaryReader): CommonStudentsResponse;
}

export namespace CommonStudentsResponse {
  export type AsObject = {
    studentsList: Array<student_pb.Student.AsObject>,
    response?: response_pb.Response.AsObject,
  }
}

