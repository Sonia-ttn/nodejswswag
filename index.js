const express=require("express");
const app=express();
const product=require("./product")
let port=5000;
const swaggerjsdoc=require('swagger-jsdoc')
const swaggerui=require("swagger-ui-express");
var cors = require('cors');
app.use(cors())
app.use(express.json());

const options={
    definition:{
        openapi:'3.0.3.',
        info:{
            title:'node js api',
            version:'1.0.0'
        },
        servers:[
            {
                url:'http://localhost:5000'
            }
        ]
        },
        apis:['./index.js']
}
const swaggerspec=swaggerjsdoc(options)
app.use("/api-docs",swaggerui.serve,swaggerui.setup(swaggerspec))

/**
 * @swagger
 * components:
 *   schemas:
 *     search:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *            type: string
 *         brand:
 *            type: string
 *         price:
 *            type: integer
 *         category:
 *            type: string
 * 
 *     add:
 *       type: object
 *       properties:
 *         name:
 *            type: string
 *         brand:
 *            type: string
 *         price:
 *            type: integer
 *         category:
 *            type: string
 */

/**
 * @swagger
 * /search:
 *  get:
 *     tags:
 *       - search
 *     summary: this is used to check if get method is working or not
 *     description: this is used to check if get method is working or not
 *     responses:
 *       200:
 *          description: to test get 
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#components/schemas/search'
 *       
 */
 
app.get("/search",async(req,res)=>{
    let data=await product.find();
    console.log(data)
    res.status(200).send(data)
})

/**
 * @swagger
 * /search/{key}:
 *  get:
 *     tags:
 *       - search 
 *     summary: this is used to check if search method is working or not
 *     description: this is used to check if search method is working or not
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         description: string name required to perform search
 *         schema:
 *           name:
 *             type: string
 *         
 *     responses:
 *       200:
 *          description: to test search 
 *          content:
 *            application/json:
 *              schema:
 *                type: array 
 *                items:
 *                  $ref: '#components/schemas/search'
 *       
 */
 

app.get("/search/:key",async(req,res)=>{
    console.log(req.params.key)
    let data=await product.find(
        {
            "$or":[
                {"name":{$regex:req.params.key}}
            ]
        }
    );
    console.log(data)
    res.send(data)
})

/**
 * @swagger
 * /create:
 *  post:
 *     tags:
 *       - add data 
 *     summary: this is used to check if add method is working or not
 *     description: this is used to check if add method is working or not
 *     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#components/schemas/add'
 * 
 *     responses:
 *       200:
 *          description: to test search    
 * 
 */

app.post("/create",async(req,res)=>{
    let data=new product(req.body);
    let result=await data.save();
    
    console.log(result)
    
    res.status(200).send(String(result))
})

/**
 * @swagger
 * /updated/{id}:
 *  put:
 *     tags:
 *       - Update data 
 *     summary: this is used to check if update method is working or not
 *     description: this is used to check if update method is working or not
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#components/schemas/add'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: string id required to perform update
 *         schema:
 *           name:
 *             type: string
 * 
 *     responses:
 *       200:
 *          description: to update data 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                items:
 *                  $ref: '#components/schemas/search'
 *                 
 */


app.put("/updated/:id",async(req,res)=>{
    console.log(req.params)
    let data= await product.updateOne(
        req.params,
        {$set:req.body})
    
    res.send(data);
 })
 

/**
 * @swagger
 * /deleted/{id}:
 *  delete:
 *     tags:
 *       - delete
 *     summary: this is used to check if delete method is working or not
 *     description: this is used to check if delete method is working or not
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: string id required to perform update
 *         schema:
 *           name:
 *             type: string
 *     responses:
 *       200:
 *          description: to test get 
 *              
 */
 

app.delete("/deleted/:id",async(req,res)=>{
    console.log("deleted id", req.params)
    let data=await product.deleteOne(req.params)
    res.status(200).send(data);
 })
 

app.listen(port,()=>{
    console.log(`server running on ${port}`)
})