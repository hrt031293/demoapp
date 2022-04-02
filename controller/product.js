var Product = require("../model/products");

let productControllerObject = {};

productControllerObject.addProduct = async (req, res) => {
    let {name, description, price} = req.body;

    if(!name || !price){
        return res.status(200).send({success: false, message: "Please ensure that you have added name and price"});
    }
    let prodObj = {name, price};
    if(description) {
        prodObj.description = description;
    }

    Product.save(prodObj).then( savedProduct => {
        return res.status(200).send({success: true, message: "Product has been saved"}); 
    }).catch(err => {
        console.log("ERROR IN SAVING Product", err);
        return res.status(200).send({success: false, message: "There is some error in saving product, please contact customer support"}); 
    })
}


productControllerObject.productList = async (req, res) => {

    let productList = await Product.find({deleted: false, display: true});

    if(productList.length) {
        return res.status(200).json({success: true, data: productList});
    } else {
        return res.status(200).send({success: false, message: "No product present"});
    }
}

productControllerObject.updateProduct = async (req, res) => {
    let {name, description, price, display } = req.body;
    let product_id = req.params.id;

    let prodObject = { name, price, display}
    if(description) {
        prodObject.description = description;
    }

    if(req.user_data.type === 'admin') {
        let foundProduct = await Product.findOne({_id: product_id});
    
        if(foundProduct){
            Product.updateOne(prodObject).then(updatedProduct => {
                return res.status(200).json({success: true, message: "Product has been updated"});
            }).catch(err => {
                console.log("ERROR IN UPDATING PRODUCT", err);
                return res.status(200).send({success: false, message: "There is error in updating product, please contact customer support"});
            })
        } else {
            return res.status(200).send({success: false, message: "No such product present"});
        }
    } else {
        return res.status(200).send({success: false, message: "Only admin is allowed to update a product"});
    }

}


productControllerObject.deleteProduct = async (req, res) => {
    let product_id = req.params.id;

    if(rwq.user_data.type === 'admin') {
        let foundProduct = await Product.findOne({_id: product_id});
    
        if(foundProduct){
            Product.updateOne({deleted: true}).then(updatedProduct => {
                return res.status(200).json({success: true, message: "Product has been deleted"});
            }).catch(err => {
                console.log("ERROR IN DELETING PRODUCT", err);
                return res.status(200).send({success: false, message: "There is error in deleting product, please contact customer support"});
            })
        } else {
            return res.status(200).send({success: false, message: "No such product present"});
        }
    } else {
        return res.status(200).send({success: false, message: "Only admin is allowed to delete a product"});
    }
    
}

module.exports = productControllerObject;