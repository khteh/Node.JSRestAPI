// package: school
// file: student.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class Student extends jspb.Message { 
    getId(): string;
    setId(value: string): Student;
    getFirstname(): string;
    setFirstname(value: string): Student;
    getLastname(): string;
    setLastname(value: string): Student;
    getEmail(): string;
    setEmail(value: string): Student;
    getIssuspended(): boolean;
    setIssuspended(value: boolean): Student;
    clearTeachersList(): void;
    getTeachersList(): Array<string>;
    setTeachersList(value: Array<string>): Student;
    addTeachers(value: string, index?: number): string;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Student.AsObject;
    static toObject(includeInstance: boolean, msg: Student): Student.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Student, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Student;
    static deserializeBinaryFromReader(message: Student, reader: jspb.BinaryReader): Student;
}

export namespace Student {
    export type AsObject = {
        id: string,
        firstname: string,
        lastname: string,
        email: string,
        issuspended: boolean,
        teachersList: Array<string>,
    }
}
