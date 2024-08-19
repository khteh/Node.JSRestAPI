// package: school
// file: school.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as school_pb from "./school_pb";
import * as student_pb from "./student_pb";
import * as teacher_pb from "./teacher_pb";
import * as response_pb from "./response_pb";

interface ISchoolService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    register: ISchoolService_IRegister;
    addStudentsToTeacher: ISchoolService_IAddStudentsToTeacher;
    commonStudents: ISchoolService_ICommonStudents;
}

interface ISchoolService_IRegister extends grpc.MethodDefinition<school_pb.RegisterRequest, response_pb.Response> {
    path: "/school.School/Register";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<school_pb.RegisterRequest>;
    requestDeserialize: grpc.deserialize<school_pb.RegisterRequest>;
    responseSerialize: grpc.serialize<response_pb.Response>;
    responseDeserialize: grpc.deserialize<response_pb.Response>;
}
interface ISchoolService_IAddStudentsToTeacher extends grpc.MethodDefinition<school_pb.AddStudentsToTeacherRequest, response_pb.Response> {
    path: "/school.School/AddStudentsToTeacher";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<school_pb.AddStudentsToTeacherRequest>;
    requestDeserialize: grpc.deserialize<school_pb.AddStudentsToTeacherRequest>;
    responseSerialize: grpc.serialize<response_pb.Response>;
    responseDeserialize: grpc.deserialize<response_pb.Response>;
}
interface ISchoolService_ICommonStudents extends grpc.MethodDefinition<school_pb.CommonStudentsRequest, school_pb.CommonStudentsResponse> {
    path: "/school.School/CommonStudents";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<school_pb.CommonStudentsRequest>;
    requestDeserialize: grpc.deserialize<school_pb.CommonStudentsRequest>;
    responseSerialize: grpc.serialize<school_pb.CommonStudentsResponse>;
    responseDeserialize: grpc.deserialize<school_pb.CommonStudentsResponse>;
}

export const SchoolService: ISchoolService;

export interface ISchoolServer extends grpc.UntypedServiceImplementation {
    register: grpc.handleUnaryCall<school_pb.RegisterRequest, response_pb.Response>;
    addStudentsToTeacher: grpc.handleUnaryCall<school_pb.AddStudentsToTeacherRequest, response_pb.Response>;
    commonStudents: grpc.handleUnaryCall<school_pb.CommonStudentsRequest, school_pb.CommonStudentsResponse>;
}

export interface ISchoolClient {
    register(request: school_pb.RegisterRequest, callback: (error: grpc.ServiceError | null, response: response_pb.Response) => void): grpc.ClientUnaryCall;
    register(request: school_pb.RegisterRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: response_pb.Response) => void): grpc.ClientUnaryCall;
    register(request: school_pb.RegisterRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: response_pb.Response) => void): grpc.ClientUnaryCall;
    addStudentsToTeacher(request: school_pb.AddStudentsToTeacherRequest, callback: (error: grpc.ServiceError | null, response: response_pb.Response) => void): grpc.ClientUnaryCall;
    addStudentsToTeacher(request: school_pb.AddStudentsToTeacherRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: response_pb.Response) => void): grpc.ClientUnaryCall;
    addStudentsToTeacher(request: school_pb.AddStudentsToTeacherRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: response_pb.Response) => void): grpc.ClientUnaryCall;
    commonStudents(request: school_pb.CommonStudentsRequest, callback: (error: grpc.ServiceError | null, response: school_pb.CommonStudentsResponse) => void): grpc.ClientUnaryCall;
    commonStudents(request: school_pb.CommonStudentsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: school_pb.CommonStudentsResponse) => void): grpc.ClientUnaryCall;
    commonStudents(request: school_pb.CommonStudentsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: school_pb.CommonStudentsResponse) => void): grpc.ClientUnaryCall;
}

export class SchoolClient extends grpc.Client implements ISchoolClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public register(request: school_pb.RegisterRequest, callback: (error: grpc.ServiceError | null, response: response_pb.Response) => void): grpc.ClientUnaryCall;
    public register(request: school_pb.RegisterRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: response_pb.Response) => void): grpc.ClientUnaryCall;
    public register(request: school_pb.RegisterRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: response_pb.Response) => void): grpc.ClientUnaryCall;
    public addStudentsToTeacher(request: school_pb.AddStudentsToTeacherRequest, callback: (error: grpc.ServiceError | null, response: response_pb.Response) => void): grpc.ClientUnaryCall;
    public addStudentsToTeacher(request: school_pb.AddStudentsToTeacherRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: response_pb.Response) => void): grpc.ClientUnaryCall;
    public addStudentsToTeacher(request: school_pb.AddStudentsToTeacherRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: response_pb.Response) => void): grpc.ClientUnaryCall;
    public commonStudents(request: school_pb.CommonStudentsRequest, callback: (error: grpc.ServiceError | null, response: school_pb.CommonStudentsResponse) => void): grpc.ClientUnaryCall;
    public commonStudents(request: school_pb.CommonStudentsRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: school_pb.CommonStudentsResponse) => void): grpc.ClientUnaryCall;
    public commonStudents(request: school_pb.CommonStudentsRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: school_pb.CommonStudentsResponse) => void): grpc.ClientUnaryCall;
}
