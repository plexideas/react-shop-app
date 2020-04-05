const express = require('express');
const multer = require('multer');
const path = require('path')

const { Product } = require('../models/Product');
const { auth } = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' || ext !== '.jpeg' || ext !== '.png') {
      return cb(res.status(400).end('only jpg, jpeg and png are allowed'), false);
    }
    cb(null, true)
  }
});

const upload = multer({ storage: storage }).single('file');

//=================================
//             Product
//=================================

router.post("/uploadImage", auth, (req, res) => {
  upload(req, res, err => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      image: res.req.file.path,
      filename: res.req.file.filename
    });
  })
});

router.post("/uploadProdutc", auth, (req, res) => {
  const product = new Product(req.body);

  product.save((err) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }
    return res.status(200).json({ success: true })
  })
});

router.post("/getProducts", auth, (req, res) => {

  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip)

  let findArgs = {};
  let term = req.body.searchTerm;

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        }
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if (term) {
    Product.find(findArgs)
    //.find({ $text: { $search: term } })
    .find({
      $or: [
        {title: {$regex: term , $options: 'i'}},
        {description: {$regex: term , $options: 'i'}}
      ]
    })
    .populate('writer')
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        console.log(err.messages);
        return res.status(400).json({ success: false, err });
      }
      res.status(200).json({
        success: true,
        products,
        postSize: products.length
      });
    });
  } else {
    Product.find(findArgs)
    .populate('writer')
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({ success: false, err });
      }
      res.status(200).json({
        success: true,
        products,
        postSize: products.length
      });
    });
  }
});

router.get(`/products_by_id`, auth, (req, res) => {
  let type = req.query.type;
  let productIds = req.query.id;

  if (type === "array") {
    let ids = req.query.id.split(',');
    productIds = [],
    productIds = ids.map(item => item);
  }

  Product.find({'_id': {$in: productIds}})
    .populate('writer')
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({ success: false, err });
      }
      res.status(200).json({
        success: true,
        products
      });
    });
});

module.exports = router;
