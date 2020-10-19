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

### 1-2, 1-3. onChange Event, Select Option 처리하기

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
