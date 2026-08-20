const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDefinitionReci = protoLoader.loadSync(path.join(__dirname, "../protos/recipes.proto"));
const packageDefinitionProc = protoLoader.loadSync(path.join(__dirname, "../protos/processing.proto"));

const recipeProto = grpc.loadPackageDefinition(packageDefinitionReci);
const processingProto = grpc.loadPackageDefinition(packageDefinitionProc);

const recipesStub = new recipeProto.Recipes('0.0.0.0:50051', grpc.credentials.createInsecure());
const processingStub = new processingProto.Processing('0.0.0.0:50052', grpc.credentials.createInsecure());

let productId = 1000;
let orderId = 1;

console.log(`searching a recipe for the product: ${productId}`);

recipesStub.find({id: productId}, (err, recipe) => {
    console.log('found a recipe');
    console.log(recipe);
    console.log('processing');

    const call = processingStub.Process({recipeId: recipe.id, orderId});
    
    call.on('data', (statusUpdate) => {
        console.log(`order status changed: `, statusUpdate);
    })

    call.on('end', () => {
        console.log('processing done');
    })
})
