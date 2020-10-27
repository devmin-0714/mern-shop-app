# react-shop-app

- 출처 : [John Ahn님 GitHub](https://github.com/jaewonhimnae)

---

## 0. 초기 설정

- `boiler-plate` 클론

- `클라이언트`와 `서버`에 `Dependencies` 다운받기

  - `npm install`
  - `Server`은 **Root** 경로, `Client`는 **client폴더** 경로

- `server/config/dev.js` 파일 설정
  - `MongoDB` 로그인
  - 클러스터, 유저 아이디와 비밀번호 생성 후 `dev.js` 파일에 넣는다.

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
⭐// UploadProductPage.js
import React from 'react'

function UploadProductPage() {
  return <div>UploadProductPage</div>
}

export default UploadProductPage
```

- **업로드 페이지 Route 만들기**

```js
⭐// App.js
import UploadProductPage from './views/UploadProductPage/UploadProductPage'
<Route
  exact
  path="/product/Upload"
  component={Auth(UploadProductPage, true)}
/>
```

- **업로드 페이지 탭 만들기**

```js
⭐// RightMenu.js
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu } from 'antd'
import axios from 'axios'
import { USER_SERVER } from '../../../Config'
import { withRouter } from 'react-router-dom'
import { useSelector } from "react-redux"

function RightMenu(props) {
  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login")
      } else {
        alert('Log Out Failed')
      }
    })
  }

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

export default withRouter(RightMenu)
```

---

### 1-2. onChange Event 처리하기<br>1-3. Select Option 처리하기

- **Drop Zone을 제외한 Form과<br>모든 INPUT을 위한 onChange Function 만들기**

```js
⭐// UploadProductPage.js
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
⭐// UploadProductPage.js
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

⭐// components/utils/FileUpload.js
import React from 'react'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd'

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

  - `npm install multer --save` (`서버`에 다운)
    `1.` **클라이언트**에서 **서버**로 `axios`를 이용해 `파일 전달`
    `2.` **서버**에서 `multer`를 이용해 `파일 저장`
    `3.` **서버**에서 **클라이언트**로 `파일저장 정보 전달`
    `4.` `response.data` 정보를 넣을 폼 생성

```js
⭐// components/utils/FileUpload.js
import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd'
import axios from 'axios'


// 1. 클라이언트에서 서버로 axios를 이용해 파일 전달
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
⭐// server/index.js
// 2. Route 설정
app.use('/api/product', require('./routes/product'))

// server/routes/product.js
const express = require('express')
const router = express.Router()
const multer = require('multer')

//=================================
//             Product
//=================================

// 2. 서버에서 multer를 이용해 파일 저장
var storage = multer.diskStorage({

  // 2. destination: 어디에 파일이 저장되는지 -> uploads 폴더
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },

  // 2. filname: uploads라는 폴더에 파일을 저장할 때 어떤 이름으로 저장할지
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

var upload = multer({ storage: storage }).single('file')

router.post('/image', (req, res) => {
  // 2. 가져온 이미지를 저장을 해주면 된다.
  upload(req, res, (err) => {
    if (err) {
      return req.json({ success: false, err })
    }
    // 3. 서버에서 클라이언트로 파일저장 정보 전달
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
⭐// components/utils/FileUpload.js
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
⭐// components/utils/FileUpload.js
function FileUpload() {

  const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image)
        let newImages = [...Images]
        // splice : currentIndex부터 1개의 아이템을 삭제
        newImages.splice(currentIndex, 1)
        setImages(newImages)
    }

  return (
	...
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

- `FileUpload.js`**(자식)**에 있는 `Image`정보를<br>`UploadProductPage.js`**(부모)**에 보내줘야<br>`Submit Button`을 실행했을 때 `Server`로 전달된다.

```js
⭐// UploadProductPage.js
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

⭐// components/utils/FileUpload.js
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
⭐// server/models/Product.js
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
⭐// UploadProductPage.js
import axios from 'axios'

function UploadProductPage(props) {
  const submitHandler = (event) => {
    event.preventDefault()

    // 모든 항목을 채우지 않으면 alert를 띄운다
    if (!Title || !Description || !Price || !Continent || Images.length === 0) {
      return alert(' 모든 값을 넣어주셔야 합니다.')
    }

    // **모든 정보를 서버로 보낸다**

    const body = {
      // UploadProductPage.js는 auth.js의 자식컴포넌트이다.
      // <SpecificComponent {...props} user={user} />
      // 로그인 된 사람의 ID
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
⭐// server/index.js
app.use('/api/product', require('./routes/product'))

⭐// server/routes/product.js
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
⭐// LandingPage.js
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

⭐// server/routes/product.js
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
⭐// LandingPage.js
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

### 2-3. 이미지 슬라이더 만들기

```js
⭐// LandingPage.js
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

⭐// components/utils/ImageSlider.js
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

### 2-4. 더보기 버튼 만들기

- **더보기 버튼을 위한 onClick Function 만들기<br>MongoDB Method인 SKIP과 LIMIT을 위한 STATE 만들기**
  - `LIMIT` : 처음 데이터를 가져올때와 더보기 버튼을 눌러서 가져올때<br>얼마나 많은 데이터를 한번에 가져오는지
  - `SKIP` : 어디서부터 데이터를 가져 오는지에 대한 위치<br>처음에는 0부터 시작, LIMIT이 6이라면 다음 번에는 `2rd Skip = 0 + 6`

```js
⭐// LandingPage.js
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

⭐// server/routes/product.js
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

### 2-6. 체크 박스 필터 만들기

- **CheckBox 리스트데이터들을 만들기**

```js
⭐// LandingPage/Sections/Datas.js
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
⭐// LandingPage.js
import { continents } from './Sections/Datas'
import CheckBox from './Sections/CheckBox'

function LandingPage() {
  ...
  return (

    {/* CheckBox */}
    <CheckBox list={continents} />

  )
}

⭐// LandingPage/sections/CheckBox.js
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
            <Collapse defaultActiveKey={['0']}>
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
⭐// LandingPage/sections/CheckBox.js
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
⭐// LandingPage.js
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

⭐// server/routes/product.js
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

### 2-9. 라디오 박스 필터 만들기

- **RadioBox 리스트 데이터들 만들기**

  - [Radio](https://ant.design/components/radio/)

- **Radioobx를 위한 UI 만들기**
- **onChange Function 만들기**
- **Checked State를 부모 컴포넌트로 업데이트 하기**
  - 같은 코드
    - `list.map((value) => <Radio key={value._id}></Radio>)`
    - `list.map((value, index) => <Radio key={index}></Radio>)`

```js
⭐// LandingPage/Sections/Datas.js
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

⭐// LandingPage.js
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

⭐// LandingPage/Sections/RadioBox.js
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
⭐// LandingPage.js
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

⭐// server/routes/product.js
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

### 2-11. 검색 기능 만들기

- **SearchFeature Component 만들기**
- **Search 기능을 위한 UI 만들기**
- **onChange Function 만들기**
- **search Data를 부모 컴포넌트에 업데이트하기**

- [Input, Search](https://ant.design/components/input/)

```js
⭐// LandingPage.js
import SearchFeature from './Sections/SearchFeature'

function LandingPage() {

  const [SearchTerm, setSearchTerm] = useState('')

  const updateSearchTerm = (newSearchTerm) => {
        setSearchTerm(newSearchTerm)
    }

  return (

    {/* Search */}
    <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '1rem auto' }}>
      <SearchFeature
        refreshFunction={updateSearchTerm}
      />
    </div>

  )
}

⭐// LandingPage/Sections/SearchFeature.js
import React, { useState } from 'react'
import { Input } from 'antd';

const { Search } = Input

function SearchFeature(props) {

    const [SearchTerm, setSearchTerm] = useState('')

    const searchHandler = (event) => {
        setSearchTerm(event.currentTarget.value)
        props.refreshFunction(event.currentTarget.value)
    }

    return (
        <div>
            <Search
                placeholder="input search text"
                onChange={searchHandler}
                style={{ width: 200 }}
                value={SearchTerm}
            />
        </div>
    )
}

export default SearchFeature
```

- **검색 값을 이용한 getProduct Function을 작동시키기**

```js
⭐// LandingPage.js
function LandingPage() {

  const updateSearchTerm = (newSearchTerm) => {

        let body = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearchTerm
        }

        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)
    }

  return (
    ...
  )
}
```

- **Search 기능을 위해서 getProduct Route 수정하기**
  - [\$text](https://docs.mongodb.com/manual/reference/operator/query/text/)

```js
⭐// server/routes/product.js
router.post('/products', (req, res) => {
  // req.body.searchTerm : "Mexico"
  let term = req.body.searchTerm
  if (term) {
    Product.find(findArgs)
      .find({ $text: { $search: term } })
      // populate : writer의 모든정보를 가져올수 있다
      .populate('writer')
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({
          success: true,
          productInfo,
          postSize: productInfo.length,
        })
      })
  } else {
    Product.find(findArgs)
      // populate : writer의 모든정보를 가져올수 있다
      .populate('writer')
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({
          success: true,
          productInfo,
          postSize: productInfo.length,
        })
      })
  }
})
```

- **Search 기능을 가능하게 하기 위해서 Product Model에 무엇을 추가 해주기**
  - [Control Search Results with Weights](https://docs.mongodb.com/manual/tutorial/control-results-of-text-search/)

```js
⭐// server/models/Product.js
const productSchema = mongoose.Schema({
    ...

productSchema.index({
    title: 'text',
    description: 'text'
}, {
    weights:{
        title: 5,
        description: 1
    }
})
```

---

## 3. 상세 보기 페이지 만들기

### 3-1. 상품의 상세정보를 데이터베이스에서 가져오기

- **빈 상품 상세 페이지 만들기**
- **Product detail page를 위한 Route 만들기**
- **product 정보를 DB에서 가져오기**

```js
// LandingPage.js
function LandingPage() {

  const renderCards = Products.map((product, index) =>
    return <Col lg={6} md={8} xs={24} key={index}>
        <Card
            cover={<a href={`/product/${product._id}`}><ImageSlider images={product.images} /></a>}
        >
            <Meta
                title={product.title}
                description={`$${product.price}`}
            />
        </Card>
    </Col>
  })

  return (
    ...
  )
}

// App.js
import DetailProductPage from './views/DetailProductPage/DetailProductPage'

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/product/:productId" component={Auth(DetailProductPage, null)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  )
}

// DetailProductPage.js
import React, { useEffect } from 'react'
import axios from 'axios'

function DetailProductPage(props) {

    const productId = props.match.params.productId

    useEffect(() => {

        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                if (response.data.success) {
                    console.log('response.data', response.data)
                } else {
                    alert('상세 정보 가져오기를 실패했습니다.')
                }
            })

    }, [])

    return (
        <div>
            DetailProductPage
        </div>
    )
}

export default DetailProductPage

// server/routes/product.js
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
```

---

### 3-2. Product Image 컴포넌트 만들기

- **Product detail 페이지 UI 만들기**

  - `ProductImage` Component
    - `npm install react-image-gallery --save` (`Client` 경로)
  - `ProductInfo` Component

- **ProductImage 페이지 만들기**
  - [react-image-gallery](https://www.npmjs.com/package/react-image-gallery)
  - thumbnail 라이브러리 : [gm -npm](https://www.npmjs.com/package/gm)

```js
// DetailProductPage.js
import ProductImage from './Sections/ProductImage'
import ProductInfo from './Sections/ProductInfo'
import { Row, Col } from 'antd'

function DetailProductPage(props) {
  const [Product, setProduct] = useState({})

  useEffect(() => {
    axios
      .get(`/api/product/products_by_id?id=${productId}&type=single`)
      .then((response) => {
        if (response.data.success) {
          console.log('response.data', response.data)
          setProduct(response.data.product[0])
        } else {
          alert('상세 정보 가져오기를 실패했습니다.')
        }
      })
  }, [])

  return (
    <div style={{ width: '100%', padding: '3rem 4rem'}}>
        <div style= {{ display: 'flex', justifyContent: 'center' }}>
            <h1>{Product.title}</h1>
        </div>
        <br />

        <Row gutter={[16, 16]}>
            <Col lg={12} sm={24}>
                {/* ProductImage */}
                <ProductImage detail={Product}/>
            </Col>
            <Col lg={12} sm={24}>
                {/* ProductInfo */}
                <ProductInfo detail={Product}/>
            </Col>
        </Row>
    </div>
    )
  )
}

// index.css
@import '~react-image-gallery/styles/css/image-gallery.css';

// DetailProductPage/Sections/ProductImage.js
import React, { useState, useEffect } from 'react'
import ImageGallery from 'react-image-gallery'

function ProductImage(props) {

    const [Images, setImages] = useState([])

    useEffect(() => {
        if (props.detail.images && props.detail.images.length > 0) {
            let images = []
            props.detail.images.map(item => {
                images.push({
                    original: `http://localhost:5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            })
            setImages(images)
        }
    }, [props.detail])

    return (
        <div>
            <ImageGallery items={Images} />
        </div>
    )
}

export default ProductImage
```

---

### 3-3. Product Info 컴포넌트 만들기

- **ProductInfo 페이지 만들기**

  - [Description](https://ant.design/components/descriptions/)

```js
import React from 'react'
import { Button, Descriptions } from 'antd'

function ProductInfo(props) {
  const clickHandler = () => {}

  return (
    <div>
      <Descriptions title="Product Info">
        <Descriptions.Item label="Price">
          {props.detail.price}
        </Descriptions.Item>
        <Descriptions.Item label="Sold">{props.detail.sold}</Descriptions.Item>
        <Descriptions.Item label="View">{props.detail.views}</Descriptions.Item>
        <Descriptions.Item label="Description">
          {props.detail.description}
        </Descriptions.Item>
      </Descriptions>

      <br />
      <br />
      <br />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button size="large" shape="round" type="danger" onClick={clickHandler}>
          Add to Cart
        </Button>
      </div>
    </div>
  )
}

export default ProductInfo
```

---

### 3-4. Add to Cart 버튼 만들기

```js
// server/models/User.js
const userSchema = mongoose.Schema({
    ...
    cart: {
        type: Array,
        default: []
    },
    history: {
        type: Array,
        default: []
    },
    ...
})

// server/routes/users.js
router.get('/auth', auth, (req, res) => {
    res.status(200).json({
        ...
        cart: req.user.cart,
        history: req.user.history
    })
})

// DetailProductPage/Sections/ProductInfo.js
import { useDispatch } from 'react-redux'
import { addToCart } from '../../../../_actions/user_actions'

function ProductInfo(props) {
    const dispatch = useDispatch()

    const clickHandler = () => {
        // 필요한 정보(id, quantity, date)를 Cart 필드에다가 넣어준다.
        dispatch(addToCart(props.detail._id))
    }

    return (
       ...
    )
}

// _actions/types.js
export const ADD_TO_CART = 'add_to_cart'

// _actions/user_actions.js
import {
    ADD_TO_CART
} from './types';

export function addToCart(id) {
    let body = {
        productId: id
    }
    const request = axios.post(`${USER_SERVER}/addToCart`, body)
        .then(response => response.data);

    return {
        type: ADD_TO_CART,
        payload: request
    }
}

// _reducers/user_reducer.js
import {
    ...
    ADD_TO_CART
} from '../_actions/types'

export default function(state={},action){
    switch(action.type){
        ...
        case ADD_TO_CART:
            return {
                ...state,
                userData: {
                    ...state.userData,
                    cart: action.payload
                }
            }
        default:
            return state;
    }
}
```

- **카트 안에 내가 추가하는 상품이 이미 있다면?(중복)**
  - 상품 개수를 1개 올리기
- **있지 않다면**
  - 필요한 상품 정보, 상품 ID, 개수 1, 날짜 정보를 다 넣어줘야 함

```js
// server/routes/users.js
router.post('/addToCart', auth, (req, res) => {
  // 먼저 User Collection에 해당 유저의 정보를 가져오기
  // auth 미들웨어를 통과하면서 req.user 안에 user 정보가 담긴다
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    // 가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어 있는지 확인
    let duplicate = false
    userInfo.cart.forEach((item) => {
      if (item.id === req.body.productId) {
        duplicate = true
      }
    })
    // 상품이 이미 있을때 -> 상품 개수를 1개 올리기
    if (duplicate) {
      User.findOneAndUpdate(
        { _id: req.user._id, 'cart.id': req.body.productId },
        { $inc: { 'cart.$.quantity': 1 } },
        // 업데이트된 정보를 받기 위해 { new: true }를 사용
        { new: true },
        (err, userInfo) => {
          if (err) return res.status(200).json({ success: false, err })
          res.status(200).send(userInfo.cart)
        }
      )
    }
    // 상품이 이미 있지 않을때 -> 필요한 상품 정보 상품 ID 개수 1, 날짜 정도 다 넣어줘야함
    else {
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            cart: {
              id: req.body.productId,
              quantity: 1,
              date: Date.now(),
            },
          },
        },
        { new: true },
        (err, userInfo) => {
          if (err) return res.status(400).json({ success: false, err })
          res.status(200).send(userInfo.cart)
        }
      )
    }
  })
})
```

---

## 4. 카트 페이지 만들기

### 4-1. Add to Cart 기능 개선 및 카트 Tab 만들기

- **빈 쇼핑 카트 페이지 만들기**
- **카트 페이지 Route 만들기**
- **Cart 페이지를 위한 탭을 만들기**
  - [Badge](https://ant.design/components/badge/)

```js
// CartPage.js
import React from 'react'

function CartPage() {
    return (
        <div>
            CartPage
        </div>
    )
}

export default CartPage

// App.js
import CartPage from './views/CartPage/CartPage'

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/user/cart" component={Auth(CartPage, true)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  )
}

// RightMenu.js
import { Menu, Icon, Badge } from 'antd'
...
} else {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="cart" style={{ paddingBottom: 3 }}>
          <Badge count={5}>
           <a href="/user/cart" className="head-example" style={{ marginRight: -22, color: '#667777'  }}>
              <Icon type="shopping-cart" style={{ fontSize: 30, marginBottom: 3 }}/>
            </a>
          </Badge>
        </Menu.Item>
      </Menu>
    )
  }
```

---

### 4-2. 카트에 담긴 상품 정보들을 데이터베이스에서 가져오기

- **카트 안에 들어가 있는 상품들을 데이터베이스에서 가져오기**
  - `User Collection`, `Product Collection`
  - 차이점 : `Quantity`가 있는지 없는지
  - 그래서 : `Product Collection`도 Quantity 정보가 필요

```js
// CartPage.js
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getCartItems } from '../../../_actions/user_actions'

function CartPage(props) {

    const dispatch = useDispatch()

    useEffect(() => {

        let cartItems = []

        // 리덕스 User state의 cart 안에 상품이 들어있는지 확인
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                })

                dispatch(getCartItems(cartItems, props.user.userData.cart))
            }
        }


    }, [props.user.userData])

    return (
        <div>
            CartPage
        </div>
    )
}

export default CartPage

// _actions/user_actions.js
import axios from 'axios';
import {
    ...
    GET_CART_ITEMS
} from './types';

export function getCartItems(cartItems, userCart) {

    const request = axios.get(`/api/product/products_by_id?id=${cartItems}&type=array`)
        .then(response => {
            // CartItem들에 해당하는 정보들을
            // Product Collection에서 가져온후에
            // Quantity 정보를 넣어 준다.
            userCart.forEach(cartItem => {
                response.data.product.forEach((productDetail, index) => {
                    if (cartItem.id === productDetail._id) {
                        response.data.product[index].quantity = cartItem.quantity
                    }
                })
            })
            return response.data
        })

    return {
        type: GET_CART_ITEMS,
        payload: request
    }
}

// _actions//types.js
export const GET_CART_ITEMS = 'get_cart_items'

// _reducers/user_reducer.js
import {
    ...
    GET_CART_ITEMS
} from '../_actions/types';

export default function(state={},action){
    switch(action.type){
            ...
            case GET_CART_ITEMS:
                return { ...state, cartDetail: action.payload }
        default:
            return state;
    }
}

// server/routes/product.js
//id=123123123,324234234,324234234  type=array
router.get('/products_by_id', (req, res) => {

   // query를 이용해서 가져올때는 req.query
  let type = req.query.type
  let productIds = req.query.id

  if (type === "array") {
      //id=123123123,324234234,324234234 이거를
      //productIds = ['123123123', '324234234', '324234234'] 이런식으로 바꿔주기
      let ids = req.query.id.split(',')
      productIds = ids.map(item => {
          return item
      })
  }

  //productId를 이용해서 DB에서  productId와 같은 상품의 정보를 가져온다.

  Product.find({ _id: { $in: productIds } })
      .populate('writer')
      .exec((err, product) => {
          if (err) return res.status(400).send(err)
          return res.status(200).json({ success: true, product })
      })
})
```

---

### 4-4. 데이터베이스에서 가져온 상품 정보들을 화면에서 보여주기

- **Cart page를 위한 UI 만들기**

  - `UserCardBlock` Component

- **데이터베이스에서 가져온 데이터를 브라우저에서 보여주기**

```js
// CartPage.js
import UserCardBlock from './Sections/UserCardBlock'

function CartPage(props) {
    ...
    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h1>My Cart</h1>

            <UserCardBlock products={props.user.cartDetail && props.user.cartDetail.product} />
        </div>
    )
}

// CartPage/Sections/UserCardBlock.js
import React from 'react'
import './UserCardBlock.css'

function UserCardBlock(props) {

    const renderCartImage = (images) => {
        if (images.length > 0) {
            let image = images[0]
            return `http://localhost:5000/${image}`
        }
    }

    const renderItems = () => (
        props.products && props.products.map(product => (
            <tr>
                <td>
                    <img style={{ width: '70px' }} alt="product"
                        src={renderCartImage(product.images)} />
                </td>
                <td>
                    {product.quantity} EA
                </td>
                <td>
                    $ {product.price}
                </td>
                <td>
                    <button>
                        Remove
                    </button>
                </td>
            </tr>
        ))
    )

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Product Quantity</th>
                        <th>Product Price</th>
                        <th>Remove from Cart</th>
                    </tr>
                </thead>

                <tbody>
                    {renderItems()}
                </tbody>
            </table>
        </div>
    )
}

export default UserCardBlock

// CartPage/Sections/UserCardBlock.css
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
```

---

### 4-5. 카트에 담긴 상품 정보 가져오는 부분 코드 수정

```js
// server/routes/product.js
router.get('/products_by_id', (req, res) => {
  ...
  Product.find({ _id: { $in: productIds } })
      .populate('writer')
      .exec((err, product) => {
          if (err) return res.status(400).send(err)
          return res.status(200).send(product)
      })
})

// DetailProductPage.js
function DetailProductPage(props) {
  ...
  useEffect(() => {

        axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                setProduct(response.data[0])
            })
            .catch(err => alert(err))
    }, [])

    return (
    ...
    )
}

// _actions/user_actions.js
export function getCartItems(cartItems, userCart) {

    const request = axios.get(`/api/product/products_by_id?id=${cartItems}&type=array`)
        .then(response => {
            userCart.forEach(cartItem => {
                response.data.forEach((productDetail, index) => {
                    if (cartItem.id === productDetail._id) {
                        response.data[index].quantity = cartItem.quantity
                    }
                })
            })
            return response.data
        })

    return {
        ...
    }
}

// CartPage.js
function CartPage(props) {
  ...
  return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h1>My Cart</h1>

            <UserCardBlock products={props.user.cartDetail} />
        </div>
    )
}
```

---

### 4-6. 카트에 들어있는 상품들 가격 계산

- **카트 안에 있는 상품 총 금액 계산**
  - `item price x quantity`

```js
// CartPage/Sections/UserCardBlock.js
function UserCardBlock(props) {
    ...
    const renderItems = () => (
        props.products && props.products.map((product, index) => (
            <tr key={index}>
                ...
            </tr>
        ))
    )

    return (
        ...
    )
}

// CartPage.js
function CartPage(props) {

    const [Total, setTotal] = useState(0)

    useEffect(() => {

        // 리덕스 User state의 cart 안에 상품이 들어있는지 확인
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                ...
                dispatch(getCartItems(cartItems, props.user.userData.cart))
                    .then(response => { calculateTotal(response.payload) })
            }
        }
    }, [props.user.userData])

    let calculateTotal = (cartDetail) => {
        let total = 0

        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity
        })

        setTotal(total)
    }

    return (
        ...
    )
}
```

---

### 4-7. 카트에 들어 있는 상품 지우기<br>4-8. 카트에 있는 모든 상품 지운 다음 처리할 것들

- **카트에서 제거하는 기능 만들기**
  - [Empty](https://ant.design/components/empty/)

```js
// CartPage/Sections/UserCardBlock.js
function UserCardBlock(props) {
    ...
    const renderItems = () => (
        props.products && props.products.map((product, index) => (
            <tr key={index}>
                ...
                <td>
                    <button onClick={() => props.removeItem(product._id)}>
                        Remove
                    </button>
                </td>
            </tr>

        ))
    )

    return (
        ...
    )
}

// CartPage.js
import { removeCartItem } from '../../../_actions/user_actions'
import { Empty } from 'antd'

function CartPage(props) {
    const [Total, setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)

    let calculateTotal = (cartDetail) => {
        let total = 0

        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity
        })

        setTotal(total)
        setShowTotal(true)
    }

    let removeFromCart = (productId) => {

        dispatch(removeCartItem(productId))
            .then(response => {
                if (response.payload.productInfo.length <= 0) {
                    setShowTotal(false)
                }
            })
    }

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h1>My Cart</h1>

            <div>
                <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart} />
            </div>

            {ShowTotal ?
                <div style={{ marginTop: '3rem' }}>
                    <h2>Total Amount: ${Total}</h2>
                </div>
                :
                <>
                    <br/>
                    <Empty description={false} />
                </>
            }

        </div>
    )
}

// _actions/user_actions.js
import {
    ...
    REMOVE_CART_ITEM
} from './types';

export function removeCartItem(productId) {

    const request = axios.get(`/api/users/removeFromCart?id=${productId}`)
        .then(response => {

           // productInfo, cart 정보를 조합해서 CartDetail을 만든다.
           response.data.cart.forEach(item => {
                response.data.productInfo.forEach((product, index) => {
                    if (item.id === product._id) {
                        response.data.productInfo[index].quantity = item.quantity
                  }

                })
            })
            return response.data
        })

    return {
        type: REMOVE_CART_ITEM,
        payload: request
    }
}

// _actions/types.js
export const REMOVE_CART_ITEM = 'remove_cart_item'

// reducers_/user_reducer.js
import {
    ...
    REMOVE_CART_ITEM
} from '../_actions/types';

export default function(state={},action){
    switch(action.type){
       ...
        case REMOVE_CART_ITEM:
            return {
                ...state, cartDetail: action.payload.productInfo,
                userData: {
                    ...state.userData,
                    cart: action.payload.cart
                }
            }
        default:
            return state;
    }
}

// server/routes/users.js
const { Product } = require('../models/Product')

router.get('/removeFromCart', auth, (req, res) => {

    // **먼저 cart안에 내가 지우려고 한 상품을 지워주기**
    User.findOneAndUpdate(
        { _id: req.user._id },
        {
            "$pull":
                { "cart": { "id": req.query.id } }
        },
        { new: true },
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })

            // **product collection에서  현재 남아있는 상품들의 정보를 가져오기**

            // productIds = ['5e8961794be6d81ce2b94752(2번째)', '5e8960d721e2ca1cb3e30de4(3번째)'] 이런식으로 바꿔주기
            Product.find({ _id: { $in: array } })
                .populate('writer')
                .exec((err, productInfo) => {
                    return res.status(200).json({
                        productInfo,
                        cart
                    })
                })
        }
    )
})
```

---

### 4-9. Paypal 버튼 만들기

- **SandBox Paypal 회원 가입**
- **Paypal을 위한 test ID 만들기**

  - [Paypal SandBox Test Accounts](https://developer.paypal.com/developer/accounts/)
  - `Account name` 중 `Default`가 안 써있는걸로 사용
  - `View/Edit Account` -> `Password` 변경

- **Payment Model 만들기**
  - `user`, `data`, `product`

```js
// server/models/Payment.js
const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema(
  {
    user: {
      type: Array,
      default: [],
    },
    data: {
      type: Array,
      default: [],
    },
    product: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
)

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = { Payment }
```

- **Paypal Button 만들기**
  - `npm install react-paypal-express-checkout --save` (`Client` 경로)
  - [react-paypal-express-checkout](https://www.npmjs.com/package/react-paypal-express-checkout)

```js
// utils/Paypal.js
import React from 'react'
import PaypalExpressBtn from 'react-paypal-express-checkout'

export default class Paypal extends React.Component {
  render() {
    const onSuccess = (payment) => {
      // Congratulation, it came here means everything's fine!
      console.log('The payment was succeeded!', payment)

      this.props.onSuccess(payment)
      // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
    }

    const onCancel = (data) => {
      // User pressed "cancel" or close Paypal's popup!
      console.log('The payment was cancelled!', data)
      // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
    }

    const onError = (err) => {
      // The main Paypal's script cannot be loaded or somethings block the loading of that script!
      console.log('Error!', err)
      // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
      // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
    }

    let env = 'sandbox' // you can set here to 'production' for production
    let currency = 'USD' // or you can set this value from your props or state
    let total = this.props.total // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
    // Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/

    const client = {
      sandbox:
        'ATHoaUPgCKoNOD4pExA8Nx_lszXC5VN2QPGdswTRv5i_v0VPFVIs8jCGdVmcZuMwWNHeV10Z1RMDXhRl',
      production: 'YOUR-PRODUCTION-APP-ID',
    }
    // In order to get production's app-ID, you will have to send your app to Paypal for approval first
    // For sandbox app-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App"):
    //   => https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
    // For production app-ID:
    //   => https://developer.paypal.com/docs/classic/lifecycle/goingLive/

    // NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!
    return (
      <PaypalExpressBtn
        env={env}
        client={client}
        currency={currency}
        total={total}
        onError={onError}
        onSuccess={onSuccess}
        onCancel={onCancel}
        style={{
          size: 'large',
          color: 'blue',
          shape: 'rect',
          label: 'checkout',
        }}
      />
    )
  }
}

// CartPage.js
import Paypal from '../../utils/Paypal'

function CartPage(props) {
    ...
    return (
      ...
      {ShowTotal &&
          <Paypal />
      }
    )
}
```

---
