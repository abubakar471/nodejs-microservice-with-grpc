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
