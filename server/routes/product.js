const express = require('express')
const router = express.Router();
const multer = require('multer')
const { Product } = require('../models/Product')

//=================================
//             Product
//=================================

// 2. 백엔드에서 multer를 이용해 파일 저장
var storage = multer.diskStorage({
    // 2. destination : 어디에 파일이 저장되는지 -> uploads 폴더
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    // 2. filname : uploads라는 폴더에 파일을 저장할 때 어떤 이름으로 저장할지
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
   
  var upload = multer({ storage: storage }).single("file")

router.post('/image', (req, res) => {

    // 2. 가져온 이미지를 저장을 해주면 된다.
    upload(req, res, err => {
        if (err) {
            return req.json({ success: false, err })
        }
        // 3. 백엔드에서 프론트로 파일저장 정보 전달
        return res.json({ success: true,
            filePath: res.req.file.path,
            fileName: res.req.file.filename})
    })
})

router.post('/', (req, res) => {

  // 보내진 정보를 몽고DB에 저장한다
  const product = new Product(req.body)

  product.save((err) => {
      if (err) return res.status(400).json({ success: false, err })
      return res.status(200).json({ success: true })
  })
})


router.post('/products', (req, res) => {

  // product collection에 들어있는 모든 상품 정보를 가져오기

  // limit과 skip을 이용해 제한된 수의 product 가져오기
  let limit = req.body.limit ? parseInt(req.body.limit) : 20
  let skip = req.body.skip ? parseInt(req.body.skip) : 0
  // req.body.searchTerm : "Mexico"
  let term = req.body.searchTerm

  let findArgs = {}

  // req.body.filters -> continents: "[1, 2, 3..]" (LandingPage.js)
  // key -> "continents": [1, 2, 3..]
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {

      if (key === "price") {
        findArgs[key] = {
          //Greater than equal
          $gte: req.body.filters[key][0],
          //Less than equal
          $lte: req.body.filters[key][1]
        }
      } else {
        findArgs[key] = req.body.filters[key]
      }
      
    }
  }

  if (term) {
    Product.find(findArgs)
    .find({ $text: { $search: term } })
      // populate : writer의 모든정보를 가져올수 있다
      .populate('writer')
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err}) 
        return res.status(200).json({
          success: true, productInfo,
          postSize: productInfo.length
        })
      })
  } else {
    Product.find(findArgs)
      // populate : writer의 모든정보를 가져올수 있다
      .populate('writer')
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err}) 
        return res.status(200).json({
          success: true, productInfo,
          postSize: productInfo.length
        })
      })
  }

})

router.get('/products_by_id', (req, res) => {

  // query를 이용해서 가져올때는 req.query
  let type = req.query.type
  let productId = req.query.id
  
  // productId를 이용해서 DB에서 productId와 같은 상품의 정보를 가져온다.
  Product.find({ _id: productId })
    .populate('writer')
    .exec((err, product) => {
      if (err) return res.status(400).send(err)
      return res.status(200).send({ success: true, product})
    })
})

module.exports = router
