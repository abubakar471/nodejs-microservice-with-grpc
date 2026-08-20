const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const express = require("express");


const packageDefinitionReci = protoLoader.loadSync(path.join(__dirname, "../protos/recipes.proto"));
const packageDefinitionProc = protoLoader.loadSync(path.join(__dirname, "../protos/processing.proto"));

const recipeProto = grpc.loadPackageDefinition(packageDefinitionReci);
const processingProto = grpc.loadPackageDefinition(packageDefinitionProc);

const recipesStub = new recipeProto.Recipes('0.0.0.0:50051', grpc.credentials.createInsecure());
const processingStub = new processingProto.Processing('0.0.0.0:50052', grpc.credentials.createInsecure());

const app = express();

app.use(express.json());

let restPort = 5000;
let orders = {};


function processAsync(order) {
    recipesStub.find({id: order.productId}, (err, recipe) => {
        if(err){
            return;
        }

        orders[order.id].recipe = recipe;

        const call = processingStub.Process({recipeId: recipe.id, orderId: order.id});
    
        call.on('data', (statusUpdate) => {
            orders[order.id].status = statusUpdate.status;
        })
    })
}

app.post('/orders', async(req,res) => {
    const productId = req.body.productId;
    
    console.log(req.body);

    if(!productId) {
        return res.status(400).send("product identifier is not set");
    }

    let orderId = Object.keys(orders).length + 1;
    let order = {
        id: orderId,
        staus: 1,
        productId,
        createdAt: new Date().toLocaleString()
    };

    orders[order.id] = order;
    processAsync(order);

    return res.status(200).send(order);
});

app.get('/orders/:id', (req,res) => {
    if(!req.params.id || !orders[req.params.id]) {
        return res.status(404).send("order not found");
    }

    res.send(orders[req.params.id]);
});

app.listen(restPort, () => {
    console.log('rest api is running on port : ', restPort);
})
