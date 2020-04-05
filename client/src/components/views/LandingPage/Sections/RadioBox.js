import React, { useState } from 'react'
import { Collapse, Radio } from 'antd';

function RadioBox(props) {

  const { handleFilters, list } = props;
  const [Value, setValue] = useState('0')

  const renderRadioBox = () => (
    list && list.map((value) => (
      <Radio key={value._id} value={`${value._id}`}>{ value.name }</Radio>
    ))
  )

  const hadleChange = (event) => {
    setValue(event.target.value);
    handleFilters(event.target.value);
  }

  return ( 
    <div>
      <Collapse defaultActiveKey={['0']}>
        <Collapse.Panel header="Price" key={1}>
          <Radio.Group onChange={hadleChange} value={Value}>
            { renderRadioBox() }
          </Radio.Group>
        </Collapse.Panel>
      </Collapse>
    </div>
  )
}

export default RadioBox
