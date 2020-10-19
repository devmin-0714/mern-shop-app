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
