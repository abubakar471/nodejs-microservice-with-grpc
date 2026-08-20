const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "./protos/recipes.proto"),
  { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true }
);

const recipesProto = grpc.loadPackageDefinition(packageDefinition);

const client = new recipesProto.Recipes(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

client.Find({ id: 1000 }, (error, response) => {
  if (error) {
    console.error("gRPC Error:", error);
  } else {
    console.log("gRPC Response Success:", response);
  }
});
