#!/usr/bin/bash
# Adapted from https://github.com/agreatfool/grpc_tools_node_protoc_ts/blob/master/examples/bash/build.sh
set -x
pwd
BASEDIR=$(dirname "$0")
#cd ${BASEDIR}/../

#mkdir -p ./src/grpc/proto
#mkdir -p ./src/grpcjs/proto
# "npx grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./grpc/client --grpc_out=grpc_js:./grpc/client --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` -I ./grpc/proto ./grpc/proto/*.proto && npx protoc --plugin=protoc-gen-ts=`which protoc-gen-ts` --ts_out=grpc_js:./grpc/client -I ./grpc/proto ./grpc/proto/*.proto",
# grpc
# JavaScript code generating
grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:./grpc/client \
--grpc_out=./grpc/client \
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
-I ./grpc/proto \
grpc/proto/*.proto

grpc_tools_node_protoc \
--plugin=protoc-gen-ts=`which protoc-gen-ts` \
--ts_out=grpc/client \
-I ./grpc/proto \
grpc/proto/*.proto

# grpc-js
# JavaScript code generating
grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:./grpc/client \
--grpc_out=grpc_js:./grpc/client \
-I ./grpc/proto \
grpc/proto/*.proto

grpc_tools_node_protoc \
--plugin=protoc-gen-ts=`which protoc-gen-ts` \
--ts_out=grpc_js:./grpc/client \
-I ./grpc/proto \
grpc/proto/*.proto

# TypeScript compiling
mkdir -p build/webapi/grpc/client
cp -r grpc/client/* build/webapi/grpc/client

tsc
