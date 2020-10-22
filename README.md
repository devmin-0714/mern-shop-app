# react-shop-app

- 출처 : [John Ahn님 GitHub](https://github.com/jaewonhimnae)

---

## 0. 초기 설정

- `boiler-plate` 클론

- 서버와 클라이언트에서 `Dependencies` 다운받기

  - `npm install`
  - `Server`은 Root경로, `Client`는 `client` 폴더경로

- `server/config/dev.js` 파일 설정
  - `MongoDB` 로그인
  - 클러스터, 아이디와 비번 생성 후 `dev.js` 파일에 넣는다.

```js
module.exports = {
  mongoURI:
    'mongodb+srv://devPark:<password>@react-boiler-plate.ovbtd.mongodb.net/<dbname>?retryWrites=true&w=majority',
}
```

---

## 1. 상품 업로드 페이지 만들기

### 1-1. 업로드 페이지 만들기 시작

- **비어 있는 업로드 페이지 생성**

```js
// UploadProductPage.js
import React from 'react'

function UploadProductPage() {
  return <div>UploadProductPage</div>
}

export default UploadProductPage
```

- **업로드 페이지 Route 만들기**

```js
// App.js
import UploadProductPage from './views/UploadProductPage/UploadProductPage'
;<Route
  exact
  path="/product/Upload"
  component={Auth(UploadProductPage, true)}
/>
```

- **업로드 페이지 탭 만들기**

```js
// RightMenu.js
// 로그인이 안된 상태
  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    )
  // 로그인이 된상태
  } else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="upload">
          <a href="/product/upload">Upload</a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
      </Menu>
    )
  }
}
```

---

### 1-2. onChange Event 처리하기<br>1-3. Select Option 처리하기

- **Drop Zone을 제외한 Form과<br>모든 INPUT을 위한 onChange Function 만들기**

```js
// UploadProductPage.js
import React, { useState } from 'react'
import { Button, Form, Input } from 'antd'

const { TextArea } = Input

const Continents = [
  { key: 1, value: 'Africa' },
  { key: 2, value: 'Europe' },
  { key: 3, value: 'Asia' },
  { key: 4, value: 'North America' },
  { key: 5, value: 'South America' },
  { key: 6, value: 'Australia' },
  { key: 7, value: 'Antarctica' },
]

function UploadProductPage() {
  const [Title, setTitle] = useState('')
  const [Description, setDescription] = useState('')
  const [Price, setPrice] = useState(0)
  const [Continent, setContinent] = useState(1)

  const titleChangeHandler = (event) => {
    setTitle(event.currentTarget.value)
  }

  const descriptionChangeHandler = (event) => {
    setDescription(event.currentTarget.value)
  }

  const priceChangeHandler = (event) => {
    setPrice(event.currentTarget.value)
  }

  const continentChangeHandler = (event) => {
    setContinent(event.currentTarget.value)
  }

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2> 여행 상품 업로드 </h2>
      </div>

      <Form>
        {/* DropZone */}
        <br />
        <br />
        <label>이름</label>
        <Input vluae={Title} onChange={titleChangeHandler} />
        <br />
        <br />
        <label>설명</label>
        <TextArea value={Description} onChange={descriptionChangeHandler} />
        <br />
        <br />
        <label>가격($)</label>
        <Input type="number" value={Price} onChange={priceChangeHandler} />
        <br />
        <br />
        <select value={Continent} onChange={continentChangeHandler}>
          {Continents.map((item) => (
            <option key={item.key} value={item.key}>
              {item.value}
            </option>
          ))}
          <option></option>
        </select>
        <br />
        <br />
        <Button>확인</Button>
      </Form>
    </div>
  )
}

export default UploadProductPage
```

---

### 1-4. Drop-Zone 적용하기<br>1-5. 이미지 파일을 서버로 보내기<br>1-6. multer를 이용하여 이미지 저장

- **Utils 폴더 안에 파일 업로드 파일 만들기**

  - `components/utils/FileUpload.js`

- **Drop-Zone 라이브러리 다운받기**

  - `npm install react-dropzone --save`

- **File 업로드 컴포넌트를 위한 UI 만들기**

  - [react-dropzone](https://www.npmjs.com/package/react-dropzone)

```js
// UploadProductPage.js
import FileUpload from '../../utils/FileUpload'

function UploadProductPage() {
  return (
    <Form>
      {/* DropZone */}
      <FileUpload />
      ...
    </Form>
  )
}

// components/utils/FileUpload.js
import React from 'react'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd'

// 1. 프론트에서 백엔드로 axios를 이용해 파일 전달
function FileUpload() {
      ...
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone onDrop={dropHandler}>
                {({getRootProps, getInputProps}) => (
                    <div
                        style={{
                            width: 300, height: 240, border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'

                        }}
                        {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Icon type="plus" style={{ fontSize: '3rem'}}/>
                    </div>
                )}
            </Dropzone>
        </div>
    )
}
```

- **onDrop Function 만들기**

  - `npm install multer --save`
    - `서버`에 다운
  - `1.` 프론트에서 백엔드로 `axios`를 이용해 `파일 전달`
  - `2.` 백엔드에서 `multer`를 이용해 `파일 저장`
  - `3.` 백엔드에서 프론트로 `파일저장 정보 전달`
  - `4.` `response.data` 정보를 넣을 폼 생성

```js
// components/utils/FileUpload.js
import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd'
import axios from 'axios'


// 1. 프론트에서 백엔드로 axios를 이용해 파일 전달
function FileUpload() {

    const dropHandler = (files) => {

        // 1. 이미지를 AJAX로 업로드할 경우 폼 전송이 필요
        let formData = new FormData()

        const config = {
            header: { 'content-type': 'multipart/form-data'}
        }
        // 1. append를 통해 키-값 형식으로 추가
        formData.append("file", files[0])

        // 1. axois를 통해 파일 전달
        axios.post('/api/product/image', formData, config)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data)
                } else {
                    alert('파일을 저장하는데 실패했습니다.')
                }
            })
    }

    return (
        ...
    )
}
```

- **multer를 이용하여 이미지 저장**
  - [multer npm](https://www.npmjs.com/package/multer)

```js
// server/index.js
// 2. Route 설정
app.use('/api/product', require('./routes/product'))

// server/routes/product.js
const express = require('express')
const router = express.Router()
const multer = require('multer')

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
  },
})

var upload = multer({ storage: storage }).single('file')

router.post('/image', (req, res) => {
  // 2. 가져온 이미지를 저장을 해주면 된다.
  upload(req, res, (err) => {
    if (err) {
      return req.json({ success: false, err })
    }
    // 3. 백엔드에서 프론트로 파일저장 정보 전달
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    })
  })
})

module.exports = router
```

- **response.data 정보를 넣을 폼 생성**

```js
// components/utils/FileUpload.js
import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd'
import axios from 'axios'

function FileUpload() {

    // 4. response.data 정보를 넣을 폼 생성
    const [Images, setImages] = useState([])
    ...
    // 4. 백엔드에 최종정보(response.data) 전달하기위해 저장
    setImages([...Images, response.data.filePath])

    return (
        ...
            {/* 4. response.data 정보를 넣을 폼 생성*/}
            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>

                {Images.map((image, index) => (
                    <div onClick={() => deleteHandler(image)} key={index}>
                        <img style={{ minWidth: '300px', width: '300px', height: '240px' }}
                            src={`http://localhost:5000/${image}`}
                        />
                    </div>
               ))}

            </div>

        </div>

    )
}
```

---

### 1-7. 이미지 지우기

- **onDelete Function 만들기**

```js
// components/utils/FileUpload.js
function FileUpload() {

  const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image)
        let newImages = [...Images]
        // splice : currentIndex부터 1개의 아이템을 삭제
        newImages.splice(currentIndex, 1)
        setImages(newImages)
    }

  return (

    {Images.map((image, index) => (
        <div onClick={() => deleteHandler(image)} key={index}>
            <img style={{ minWidth: '300px', width: '300px', height: '240px' }}
                src={`http://localhost:5000/${image}`}
            />
        </div>
    ))}
  )
}
```

---

### 1-8. 이미지 State를 부모 컴포넌트로 업데이트하기

- `FileUpload.js`(자식)에 있는 `Image`정보를<br>`UploadProductPage.js`(부모)에 보내줘야<br>`Submit Button`을 실행했을 때 `Server`로 전달된다.

```js
// UploadProductPage.js
function UploadProductPage() {

  const [Images, setImages] = useState([])

  const updateImages = (newImages) => {
        setImages(newImages)
  }

  return(

    {/* DropZone */}
    <FileUpload refreshFunction={updateImages}/>

  )
}

// components/utils/FileUpload.js
function FileUpload(props) {

  const dropHandler = (files) => {
        ...
        axios.post('/api/product/image', formData, config)
            .then(response => {
                if (response.data.success) {
                    ...
                    props.refreshFunction([...Images, response.data.filePath])
                } else {
                    ...
                }
            })
    }

  const deleteHandler = (image) => {
        ...
        props.refreshFunction(newImages)
    }

  return(
    ...
  )
}
```

---

### 1-9. 모든 상품 정보를 데이터베이스에 저장하기

- **Product Model 만들기**

```js
// server/models/Product.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      maxlength: 50,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
      default: [],
    },
    sold: {
      type: Number,
      maxlength: 100,
      default: 0,
    },
    continents: {
      type: Number,
      default: 1,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
) // 등록시간

const Product = mongoose.model('Product', productSchema)

module.exports = { Product }
```

- **onSubmit Function 만들기, 모든 정보를 서버로 보내기**

```js
// UploadProductPage.js
import axios from 'axios'

function UploadProductPage(props) {
  const submitHandler = (event) => {
    event.preventDefault()

    // 모든 항목을 채우지 않으면 alert를 띄운다
    if (!Title || !Description || !Price || !Continent || Images.length === 0) {
      return alert(' 모든 값을 넣어주셔야 합니다.')
    }

    // 모든 정보를 서버로 보낸다

    const body = {
      // UploadProductPage.js는 auth.js의 자식컴포넌트이다.
      // <SpecificComponent {...props} user={user} />
      //로그인 된 사람의 ID
      writer: props.user.userData._id,
      title: Title,
      description: Description,
      price: Price,
      images: Images,
      continents: Continent,
    }

    axios.post('/api/product', body).then((response) => {
      if (response.data.success) {
        alert('상품 업로드에 성공 했습니다.')
        props.history.push('/')
      } else {
        alert('상품 업로드에 실패 했습니다.')
      }
    })
  }

  return (
    // UploadProductPage.js
    <Form onSubmit={submitHandler}>
      ...
      <Button type="submit" onClick={submitHandler}>
        확인
      </Button>
    </Form>
  )
}
```

- **보내진 정보를 몽고DB에 저장하기**

```js
// server/index.js
app.use('/api/product', require('./routes/product'))

// server/routes/product.js
const { Product } = require('../models/Product')

router.post('/', (req, res) => {
  // 보내진 정보를 몽고DB에 저장한다
  const product = new Product(req.body)

  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err })
    return res.status(200).json({ success: true })
  })
})
```

---

## 2. 랜딩 페이지 만들기

### 2-1. 데이터베이스에 들어 있는 모든 상품을 가져오기

- **몽고 DB에 저장되어 있는 데이터들을 가져오기**

```js
// LandingPage.js
import React, { useEffect } from 'react'
import axios from 'axios'

function LandingPage() {
  useEffect(() => {
    axios.post('/api/product/products').then((response) => {
      if (response.data.success) {
        console.log(response.data)
      } else {
        alert(' 상품들을 가져오는데 실패했습니다. ')
      }
    })
  }, [])

  return <div>Landing Page</div>
}

export default LandingPage

// server/routes/product.js
const { Product } = require('../models/Product')

router.post('/products', (req, res) => {
  // product collection에 들어있는 모든 상품 정보를 가져오기
  Product.find()
    // populate : writer의 모든정보를 가져올수 있다
    .populate('writer')
    .exec((err, productInfo) => {
      if (err) return res.status(400).json({ success: false, err })
      return res.status(200).json({ success: true, productInfo })
    })
})
```

---

### 2-2. 카드 만들기

- **랜딩 페이지 UI 만들기**

```js
// LandingPage.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Icon, Col, Card, Row } from 'antd'
import Meta from 'antd/lib/card/Meta'

function LandingPage() {
  const [Products, setProducts] = useState([])

  useEffect(() => {
    axios.post('/api/product/products').then((response) => {
      if (response.data.success) {
        setProducts(response.data.productInfo)
      } else {
        alert(' 상품들을 가져오는데 실패했습니다. ')
      }
    })
  }, [])

  const renderCards = Products.map((product, index) => {
    return (
      <Col lg={6} md={8} xs={24} key={index}>
        <Card
          cover={
            <img
              style={{ width: '100%', maxHeight: '150px' }}
              src={`http://localhost:5000/${product.images[0]}`}
            />
          }
        >
          <Meta title={product.title} description={`$${product.price}`} />
        </Card>
      </Col>
    )
  })

  return (
    <div style={{ width: '75%', margin: '3rem auto' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>
          Let's Travel Anywhere
          <Icon type="rocket" />
        </h2>
      </div>

      {/* Filter */}

      {/* Search */}

      {/* Cards*/}
      <Row gutter={[16, 16]}>{renderCards}</Row>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button>더보기</button>
      </div>
    </div>
  )
}

export default LandingPage
```

---

## 2-3. 이미지 슬라이더 만들기

```js
// LandingPage.js
import Meta from 'antd/lib/card/Meta'
import ImageSlider from '../../utils/ImageSlider'

function LandingPage() {

  const renderCards = Products.map((product, index) => {

        return <Col lg={6} md={8} xs={24} key={index}>
            <Card
                cover={<ImageSlider images={product.images} />}
            >
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })

  return (

    {/* Cards*/}
    <Row gutter={[16, 16]}>
        {renderCards}
    </Row>

  )
}

// components/utils/ImageSlider.js
import React from 'react'
import { Carousel } from 'antd'

function ImageSlider(props) {
    return (
        <div>
            <Carousel autoplay>
                {props.images.map((image, index) => (
                    <div key={index}>
                        <img style={{ width: '100%', maxHeight: '150px' }}
                            src={`http://localhost:5000/${image}`} />
                    </div>
                ))}
            </Carousel>
        </div>
    )
}

export default ImageSlider
```

---

## 2-4. 더보기 버튼 만들기

- **더보기 버튼을 위한 onClick Function 만들기<br>MongoDB Method인 SKIP과 LIMIT을 위한 STATE 만들기**
  - `LIMIT` : 처음 데이터를 가져올때와 더보기 버튼을 눌러서 가져올때<br>얼마나 많은 데이터를 한번에 가져오는지
  - `SKIP` : 어디서부터 데이터를 가져 오는지에 대한 위치<br>처음에는 0부터 시작, LIMIT이 6이라면 다음 번에는 `2rd Skip = 0 + 6`

```js
// LandingPage.js
function LandingPage() {

  const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)

    useEffect(() => {

        // 상품 8개만 가져오기
        let body = {
            skip: Skip,
            limit: Limit
        }

        getProducts(body)

    }, [])

    const getProducts = (body) => {
        axios.post('/api/product/products', body)
            .then(response => {
                if (response.data.success) {
                    if (body.loadMore) {
                        setProducts([...Products, ...response.data.productInfo])
                    } else {
                        setProducts(response.data.productInfo)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert(' 상품들을 가져오는데 실패했습니다. ')
                }
            })
    }

    const loadMoreHandler = () => {

        // 더보기 버튼을 눌렀을 때 추가 product를 가져올때는 Skip 부분이 달라진다
        // Skip (0 -> 8) + Limit (8 -> 8)
        let skip = Skip + Limit

        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }

        getProducts(body)
        setSkip(skip)
    }

  return (

    {PostSize >= Limit &&
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button onClick={loadMoreHandler}>더보기</button>
        </div>
    }

  )
}

// server/routes/product.js
router.post('/products', (req, res) => {

  // product collection에 들어있는 모든 상품 정보를 가져오기

  // limit과 skip을 이용해 제한된 수의 product 가져오기
  let limit = req.body.limit ? parseInt(req.body.limit) : 20
  let skip = req.body.skip ? parseInt(req.body.skip) : 0

  Product.find()
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

})
```

---

## 2-6. 체크 박스 필터 만들기

- **CheckBox 리스트데이터들을 만들기**

```js
// LandingPage/Sections/Datas.js
const continents = [
  {
    _id: 1,
    name: 'Africa',
  },
  {
    _id: 2,
    name: 'Europe',
  },
  {
    _id: 3,
    name: 'Asia',
  },
  {
    _id: 4,
    name: 'North America',
  },
  {
    _id: 5,
    name: 'South America',
  },
  {
    _id: 6,
    name: 'Australia',
  },
  {
    _id: 7,
    name: 'Antarctica',
  },
]

export { continents }
```

- **CheckBox를 위한 UI 만들기**
  - [Collapse](https://ant.design/components/collapse/)
  - [Checkbox](https://ant.design/components/checkbox/)

```js
// LandingPage.js
import { continents } from './Sections/Datas'
import CheckBox from './Sections/CheckBox'

function LandingPage() {
  ...
  return (

    {/* CheckBox */}
    <CheckBox list={continents} />

  )
}

// LandingPage/sections/CheckBox.js
import React from 'react'
import { Collapse, Checkbox } from 'antd'

const { Panel } = Collapse

function CheckBox(props) {


    const renderCheckBoxLists = () => props.list && props.list.map((value, index) => (
        <React.Fragment key={index}>
            <Checkbox onChange />
                <span>{value.name}</span>
        </React.Fragment>
    ))


    return (
        <div>
            <Collapse defaultActiveKey={['1']}>
                <Panel header="Continents" key="1">

                    {renderCheckBoxLists()}

                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox
```

- **onChange Function 만들기**

```js
// LandingPage/sections/CheckBox.js
function CheckBox(props) {

    const [Checked, setChecked] = useState([])

    const handleToggle = (value) => {

        // 체크박스 누른 것의 Index를 구하고
        const currentIndex = Checked.indexOf(value)

        // 전체 Checked된 State에서 현재 누른 Checkbox가 이미 있다면
        const newChecked = [...Checked]

        // (value 값이 없다면 value값을 넣어준다)
        if (currentIndex === -1) {
            newChecked.push(value)

        // 빼주고
        } else {
            newChecked.splice(currentIndex, 1)
        }

        // State에 넣어준다
        setChecked(newChecked)

        // 부모 컴포넌트에 전달
        props.handleFilters(newChecked)
    }

    const renderCheckBoxLists = () => props.list && props.list.map((value, index) => (
        <React.Fragment key={index}>
            <Checkbox onChange={() => handleToggle(value._id)} checked={Checked.indexOf(value._id) === -1 ? false : true} />
                <span>{value.name}</span>
        </React.Fragment>
    ))

    return (
      ...
    )
}

```

- **Chcked State를 부모 컴포넌트로 업데이트하기**

```js
// LandingPage.js
function LandingPage() {

  const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })

  const handleFilters = (filters, category) => {
      const newFilters = {...Filters}
      newFilters[category] = filters
      showFilteredResults(newFilters)
  }

  return (

    {/* CheckBox */}
    <CheckBox list={continents} handleFilters={filters => handleFilters(filters, "continents")}/>

  )
}

// server/routes/product.js
router.post('/products', (req, res) => {

  // product collection에 들어있는 모든 상품 정보를 가져오기

  // limit과 skip을 이용해 제한된 수의 product 가져오기
  let limit = req.body.limit ? parseInt(req.body.limit) : 20
  let skip = req.body.skip ? parseInt(req.body.skip) : 0

  let findArgs = {}

  // req.body.filters -> continents: "[1, 2, 3..]" (LandingPage.js)
  // key -> "continents": [1, 2, 3..]
  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      findArgs[key] = req.body.filters[key]
    }
  }

  Product.find(findArgs)
    ...
})
```

---

## 2-9. 라디오 박스 필터 만들기

- **RadioBox 리스트 데이터들 만들기**

  - [Radio](https://ant.design/components/radio/)

- **Radioobx를 위한 UI 만들기**
- **onChange Function 만들기**
- **Checked State를 부모 컴포넌트로 업데이트 하기**
  - 같은 코드
    - `list.map((value) => <Radio key={value._id}></Radio>)`
    - `list.map((value, index) => <Radio key={index}></Radio>)`

```js
// LandingPage/Sections/Datas.js
const price = [
  {
    _id: 0,
    name: 'Any',
    array: [],
  },
  {
    _id: 1,
    name: '$0 to $249',
    array: [0, 249],
  },
  {
    _id: 2,
    name: '$250 to $499',
    array: [250, 499],
  },
  {
    _id: 3,
    name: '$500 to $749',
    array: [500, 749],
  },
  {
    _id: 4,
    name: '$750 to $999',
    array: [750, 999],
  },
  {
    _id: 5,
    name: 'More than $1000',
    array: [1000, 1500000],
  },
]

export { price }

// LandingPage.js
import { price } from './Sections/Datas'
import Radiobox from './Sections/RadioBox'

function LandingPage() {
  ...
  return (

    {/* Filter */}

    <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
            {/* CheckBox */}
            <Checkbox list={continents}
            handleFilters={filters => handleFilters(filters, "continents")} />
        </Col>
        <Col lg={12} xs={24}>
            {/* RadioBox */}
            <Radiobox list={price}
            handleFilters={filters => handleFilters(filters, "price")} />
        </Col>
    </Row>

  )

}

// LandingPage/Sections/RadioBox.js
import React, { useState } from 'react'
import { Collapse, Radio } from 'antd'

const { Panel } = Collapse

function RadioBox(props) {

    // Value : price._id (Datas.js)
    const [Value, setValue] = useState(0)

    const renderRadioBox = () => (
        props.list && props.list.map(value => (
            <Radio key={value._id} value={value._id}> {value.name} </Radio>
        ))
    )

    const handleChange = (event) => {
        setValue(event.target.value)
        props.handleFilters(event.target.value)
    }

    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel header="Price" key="1">

                    <Radio.Group onChange={handleChange} value={Value}>
                        {renderRadioBox()}
                    </Radio.Group>

                </Panel>
            </Collapse>
        </div>
    )
}

export default RadioBox
```

- **handleFilter Function 만들기**
- **handleFilter를 위한 handlePrice function 만들기**
- **필터 기능을 위한 getProduct Route 수정하기**

```js
// LandingPage.js
function LandingPage() {

  const handlePrice = (value) => {
        const data = price
        let array = []

        for (let key in data) {
            if (data[key]._id === parseInt(value, 10)) {
                array = data[key].array
            }
        }
        return array
    }

    const handleFilters = (filters, category) => {
        const newFilters = {...Filters}
        newFilters[category] = filters

        if (category === "price") {
            let priceValues = handlePrice(filters)
            newFilters[category] = priceValues
        }
        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

  return (
    ...
  )
}

// server/routes/product.js
router.post('/products', (req, res) => {

  ...

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

  ...

})
```

---
