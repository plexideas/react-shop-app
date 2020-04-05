import React, { useState } from 'react'
import { Input } from 'antd'

const { Search } = Input;

function SearchFeature(props) {
  
  const { refreshFunction } = props;
  const [SearchTerms, setSearchTerms] = useState("")

  const onChangeSearch = (event) => {
    setSearchTerms(event.target.value);
    refreshFunction(event.target.value);
  }

  return (
    <div>
      <Search 
        value={SearchTerms}
        onChange={onChangeSearch}
        placeholder="Search by Typing..."
      />
    </div>
  )
}

export default SearchFeature
