import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Icon } from 'antd'
import axios from 'axios'


// 1. 프론트에서 백엔드로 axios를 이용해 파일 전달
function FileUpload(props) {

    // 4. response.data 정보를 넣을 폼 생성
    const [Images, setImages] = useState([])

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
                    // 4. 백엔드에 최종정보(response.data) 전달하기위해 저장
                    setImages([...Images, response.data.filePath])
                    props.refreshFunction([...Images, response.data.filePath])
                } else {
                    alert('파일을 저장하는데 실패했습니다.')
                }
            })
    }

    const deleteHandler = (image) => {

        const currentIndex = Images.indexOf(image)
        let newImages = [...Images]
        // splice : currentIndex부터 1개의 아이템을 삭제
        newImages.splice(currentIndex, 1)
        setImages(newImages)
        props.refreshFunction(newImages)
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

export default FileUpload