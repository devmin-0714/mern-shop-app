import React, { useState } from 'react'
import { Collapse, Checkbox } from 'antd'

const { Panel } = Collapse

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
