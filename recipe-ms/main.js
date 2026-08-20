const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "../protos/recipes.proto"),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
);

const recipesProto = grpc.loadPackageDefinition(packageDefinition);

const RECIPES = [
  {
    id: 100,
    productId: 1000,
    title: "Pizza",
    notes: "See video: pizza_recipe.mp4. Use oven no. 12"
  },
  {
    id: 200,
    productId: 2000,
    title: "Lasagna",
    notes: "Ask tanni. Use any oven, but make sure to pre-heat it."
  }
];

function findRecipe(call, callback) {
  console.log("find request:", call.request);
  
  const productId = Number(call.request.id);

  const recipe = RECIPES.find(
    r => r.productId === productId
  );

  if (!recipe) {
    return callback({
      code: grpc.status.NOT_FOUND,
      message: `Recipe not found for product ID ${productId}`
    });
  }

  return callback(null, recipe);
}

const server = new grpc.Server();

server.addService(recipesProto.Recipes.service, {
  find: findRecipe
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error("Server failed to start:", error);
      return;
    }
    console.log(`gRPC server running on port ${port}`);
  }
);
