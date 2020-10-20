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

// 1. 프론트엔드에서 파일전달
function FileUpload() {

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

export default FileUpload
```

- **onDrop Function 만들기**

  - `npm install multer --save`
    - `서버`에 다운
  - 1. 프론트에서 백엔드로 `axios`를 이용해 `파일 전달`
  - 2. 백엔드에서 `multer`를 이용해 `파일 저장`
  - 3. 백엔드에서 프론트로 `파일저장 정보 전달`
  - 4. `response.data` 정보를 넣을 폼 생성

```js
// components/utils/FileUpload.js
import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd'
import axios from 'axios'


// 1. 프론트엔드에서 파일전달
function FileUpload() {

    const dropHandler = (files) => {

        // 1. 이미지를 AJAX로 업로드할 경우 폼 전송이 필요
        let formData = new FormData()

        // 1.
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
)
                } else {
                    alert('파일을 저장하는데 실패했습니다.')
                }
            })
    }

    return (
        ...
    )
}

export default FileUpload
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
    setImages([...Images, response.data.filePath]

    return (

        ...

            {/* 4. response.data 정보를 넣을 폼 생성*/}
            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>

                {Images.map((image, index) => (
                    <div key={index}>
                        <img style={{ minWidth: '300px', width: '300px', height: '240px' }}
                            src={`http://localhost:5000/${image}`}
                        />
                    </div>
               ))}

            </div>

        </div>

    )
}

export default FileUpload
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
function UploadProductPage(props) {

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
            return alert(" 모든 값을 넣어주셔야 합니다.")
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
            continents: Continent
        }

        axios.post('/api/product', body)
            .then(response => {
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
    <Button type="submit">
        확인
    </Button>
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
