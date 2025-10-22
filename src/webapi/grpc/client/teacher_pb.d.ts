// package: school
// file: teacher.proto

import * as jspb from "google-protobuf";

export class Teacher extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getFirstname(): string;
  setFirstname(value: string): void;

  getLastname(): string;
  setLastname(value: string): void;

  getEmail(): string;
  setEmail(value: string): void;

  clearStudentsList(): void;
  getStudentsList(): Array<string>;
  setStudentsList(value: Array<string>): void;
  addStudents(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Teacher.AsObject;
  static toObject(includeInstance: boolean, msg: Teacher): Teacher.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Teacher, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Teacher;
  static deserializeBinaryFromReader(message: Teacher, reader: jspb.BinaryReader): Teacher;
}

export namespace Teacher {
  export type AsObject = {
    id: string,
    firstname: string,
    lastname: string,
    email: string,
    studentsList: Array<string>,
  }
}

