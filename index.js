const port = 4000;
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
const multer = require("multer");
const path = require("path"); // Ensure path is imported

app.use(express.json());
app.use(cors());

// Database connection
mongoose.connect("mongodb+srv://AmanEcommerce:Aman%4012345@cluster0.tbumc.mongodb.net/E-Commerce")
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });

// API Creation
app.get("/", (req, res) => {
    res.send("Express app is running");
});

// Image Storage Engine
const Storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: Storage }); // Corrected reference

// Creating Upload Endpoints for images
app.use('/images', express.static('upload/images'));
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Schema for creating products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now, // Changed to default
    },
    available: {
        type: Boolean,
        default: true, // Changed to default
    },
});

app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_products_array[0];
        id = last_product.id+1;
    }
    else{
        id = 1
    }
    const product = new Product({
        id: req.body.id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(Product);
    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name,
    });
});

//Creating APi for deleting products

app.post('/removeproduct',async (req,res)=> {
    await Products.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on port " + port);
    } else {
        console.log("Error: " + error);
    }
});
