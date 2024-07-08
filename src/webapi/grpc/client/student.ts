/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 3.20.3
 * source: student.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export namespace school {
    export class student extends pb_1.Message {
        #one_of_decls: number[][] = [];
        constructor(data?: any[] | {
            firstName?: string;
            lastName?: string;
            email?: string;
            isSuspended?: boolean;
            teachers?: string[];
        }) {
            super();
            pb_1.Message.initialize(this, Array.isArray(data) ? data : [], 0, -1, [5], this.#one_of_decls);
            if (!Array.isArray(data) && typeof data == "object") {
                if ("firstName" in data && data.firstName != undefined) {
                    this.firstName = data.firstName;
                }
                if ("lastName" in data && data.lastName != undefined) {
                    this.lastName = data.lastName;
                }
                if ("email" in data && data.email != undefined) {
                    this.email = data.email;
                }
                if ("isSuspended" in data && data.isSuspended != undefined) {
                    this.isSuspended = data.isSuspended;
                }
                if ("teachers" in data && data.teachers != undefined) {
                    this.teachers = data.teachers;
                }
            }
        }
        get firstName() {
            return pb_1.Message.getFieldWithDefault(this, 1, "") as string;
        }
        set firstName(value: string) {
            pb_1.Message.setField(this, 1, value);
        }
        get lastName() {
            return pb_1.Message.getFieldWithDefault(this, 2, "") as string;
        }
        set lastName(value: string) {
            pb_1.Message.setField(this, 2, value);
        }
        get email() {
            return pb_1.Message.getFieldWithDefault(this, 3, "") as string;
        }
        set email(value: string) {
            pb_1.Message.setField(this, 3, value);
        }
        get isSuspended() {
            return pb_1.Message.getFieldWithDefault(this, 4, false) as boolean;
        }
        set isSuspended(value: boolean) {
            pb_1.Message.setField(this, 4, value);
        }
        get teachers() {
            return pb_1.Message.getFieldWithDefault(this, 5, []) as string[];
        }
        set teachers(value: string[]) {
            pb_1.Message.setField(this, 5, value);
        }
        static fromObject(data: {
            firstName?: string;
            lastName?: string;
            email?: string;
            isSuspended?: boolean;
            teachers?: string[];
        }): student {
            const message = new student({});
            if (data.firstName != null) {
                message.firstName = data.firstName;
            }
            if (data.lastName != null) {
                message.lastName = data.lastName;
            }
            if (data.email != null) {
                message.email = data.email;
            }
            if (data.isSuspended != null) {
                message.isSuspended = data.isSuspended;
            }
            if (data.teachers != null) {
                message.teachers = data.teachers;
            }
            return message;
        }
        toObject() {
            const data: {
                firstName?: string;
                lastName?: string;
                email?: string;
                isSuspended?: boolean;
                teachers?: string[];
            } = {};
            if (this.firstName != null) {
                data.firstName = this.firstName;
            }
            if (this.lastName != null) {
                data.lastName = this.lastName;
            }
            if (this.email != null) {
                data.email = this.email;
            }
            if (this.isSuspended != null) {
                data.isSuspended = this.isSuspended;
            }
            if (this.teachers != null) {
                data.teachers = this.teachers;
            }
            return data;
        }
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        serialize(w?: pb_1.BinaryWriter): Uint8Array | void {
            const writer = w || new pb_1.BinaryWriter();
            if (this.firstName.length)
                writer.writeString(1, this.firstName);
            if (this.lastName.length)
                writer.writeString(2, this.lastName);
            if (this.email.length)
                writer.writeString(3, this.email);
            if (this.isSuspended != false)
                writer.writeBool(4, this.isSuspended);
            if (this.teachers.length)
                writer.writeRepeatedString(5, this.teachers);
            if (!w)
                return writer.getResultBuffer();
        }
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): student {
            const reader = bytes instanceof pb_1.BinaryReader ? bytes : new pb_1.BinaryReader(bytes), message = new student();
            while (reader.nextField()) {
                if (reader.isEndGroup())
                    break;
                switch (reader.getFieldNumber()) {
                    case 1:
                        message.firstName = reader.readString();
                        break;
                    case 2:
                        message.lastName = reader.readString();
                        break;
                    case 3:
                        message.email = reader.readString();
                        break;
                    case 4:
                        message.isSuspended = reader.readBool();
                        break;
                    case 5:
                        pb_1.Message.addToRepeatedField(message, 5, reader.readString());
                        break;
                    default: reader.skipField();
                }
            }
            return message;
        }
        serializeBinary(): Uint8Array {
            return this.serialize();
        }
        static deserializeBinary(bytes: Uint8Array): student {
            return student.deserialize(bytes);
        }
    }
}
