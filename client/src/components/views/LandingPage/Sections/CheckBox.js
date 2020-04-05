import React,  { useState } from 'react';
import { Checkbox, Collapse } from 'antd';

const { Panel } = Collapse;

function CheckBox(props) {

  const { handleFilters, list } = props;
  const [Checked, setChecked] = useState([]);

  const handleToggle = (value) => {
    const currentIndex = Checked.indexOf(value);
    const newChecked = [...Checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    handleFilters(newChecked);
  }

  return (
    <div>
      <Collapse defaultActiveKey={['0']}>
        <Panel header="Continents" key="1">
          {
            list.map((value, index) => (
              <React.Fragment key={index}>
                <Checkbox
                  onChange={() => handleToggle(value._id)}
                  type="checkbox"
                  checked={Checked.indexOf(value._id) === -1 ? false : true}
                />
                <span>{value.name}</span>
              </React.Fragment>
            ))
          }
        </Panel>
      </Collapse>
    </div>
  );
};

export default CheckBox;
