import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';


const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;

        let imageUrls = "";
        if (req.files && req.files.length > 0) {
            const urls = [];
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path);
                urls.push(result.secure_url);
            }
            imageUrls = urls.join(",");
        } else if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrls = result.secure_url;
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrls  // ← matches model field name now
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.stock = stock || product.stock;

            if (req.files && req.files.length > 0) {
                const urls = [];
                for (const file of req.files) {
                    const result = await cloudinary.uploader.upload(file.path);
                    urls.push(result.secure_url);
                }
                product.imageUrls = urls.join(",");
            } else if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                product.imageUrls = result.secure_url;
            }

            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.status(200).json({ message: "Product removed" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            const alreadyReviewed = product.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({ message: "Product already reviewed" });
            }

            const review = {
                name: req.user.name,
                rating: Number(rating),
                comment,
                user: req.user._id
            };

            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

            await product.save();
            res.status(201).json({ message: "Review added successfully", rating: product.rating, numReviews: product.numReviews });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview };

