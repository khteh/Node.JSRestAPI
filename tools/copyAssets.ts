import shelljs from "shelljs";

// Copy all the view templates
shelljs.cp("-R", "src/webapi/views", "build/src/webapi");
shelljs.cp("-R", "config", "build");
shelljs.mkdir("-p", "build/src/webapi/grpc/client");
shelljs.cp("-R", "src/webapi/grpc/client/*", "build/src/webapi/grpc/client");