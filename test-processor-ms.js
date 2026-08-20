const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "./protos/processing.proto"),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);

const processingProto = grpc.loadPackageDefinition(packageDefinition);

// 1. Initialize Client Stub pointing to processor-ms on port 50052
const client = new processingProto.Processing(
  "127.0.0.1:50052",
  grpc.credentials.createInsecure()
);

console.log("--> Invoking Process stream...");

// 2. Call the server-streaming RPC function
const stream = client.Process({ recipeId: 100, orderId: 2 });

// 3. Listen for streamed chunks from processor-ms
stream.on("data", (chunk) => {
  console.log(" [STREAM RECEIVED]:", chunk);
});

// 4. Listen for the stream completion event
stream.on("end", () => {
  console.log(" [STREAM COMPLETED]: Server closed the stream.");
});

// 5. Listen for errors
stream.on("error", (err) => {
  console.error(" [STREAM ERROR]:", err);
});
