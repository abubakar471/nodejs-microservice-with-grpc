# Codebase Architecture

Even though real-world microservices typically reside in separate computers or containers, we’ll create a monorepo-oriented Node.js project for this

# Create a node.js project in root directory

```
npm init
```

# Install the @grpc/grpc-js @grpc-proto-loader and express

```
npm i @grpc/grpc-js @grpc/proto-loader express 
```

# Install the concurrently package to run all of these 3 services with a single command

```
npm i -D concurrently
```

# Create a new directory to store the Protobufs files

```
mkdir protos
```

# Writing the Protobuf Definitions

Here, in the protos directory we will write the protobuf definition for our services.

### ./protos/recipes.proto

This is protobuf file for the communication between main microservice and recipe selector service.

Here, we defined the Find procedure to return Recipe object based on the ProductId, which is a unique identifier for a food product. Note that, we need to group all the procedures with a service definition, like Recipes.

### ./protos/processing.proto

We defined the Process procedure to return a stream of OrderStatusUpdate messages to track the order status change events. Besides, the Process procedure expects a OrderRequest message as the parameter.

---

# Developing gRPC servers

Now, that our protobuf definitions are ready, we can develop our gRPC servers. The main microservice is a gRPC client that communicates with two secondary microservices. So, first we need to implement two gRPC servers for secondary microservices.

### ./recipe-ms/main.js

This spawns a gRPC server instance on the the port 50051 and handles gRPC messages based on the service definition in the recipes.proto file. 

Whenever a gRPC client executes the "find" procedure with a valid "product identifier", the server finds an appropriate recipe and sends it back via the "callback" function (using the unary mode).

### ./processor-ms/main.js

In this gRPC server we also add one procedure but here we used the streaming mode. Whenever the microservice gets a new order request to process, it streams the newly created order status via the call.write function. We used the call.end function call to indicate the end of the stream instead of using callback, as we used in the previous unary microservice communication implementation.

---

# Update package.json to start the microservices together

```
"scripts": {
  "start-recipe-ms": "node ./recipe-ms/main.js",
  "start-processor-ms": "node ./processor-ms/main.js",
  "start": "concurrently 'npm run start-recipe-ms' 'npm run start-processor-ms'"
},
```

### ./test-recipe-ms.js 

It is test client just to test the recipe microservice.

### ./test-processor-ms.js

It is a test client just to test the processor microservice.

---

