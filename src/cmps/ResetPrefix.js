import React, { useState } from 'react'
import Select from 'react-select';
import Button from "monday-ui-react-core/dist/Button.js"

export default function ResetPrefix({ prefixKeys, resetPrefix }) {

  const [selectedOption, setSelectedOption] = useState(null)



  const handleSelect = (selectedOption) => {
    console.log('handleSelect -> selectedOption', selectedOption)
    setSelectedOption(selectedOption)
  }

  const onResetPrefix = () => {
    if (!selectedOption.value) return
    resetPrefix(selectedOption.value)

  }

  return (
    <form className="reset-prefix">
      <Select
        placeholder="Choose prefix to reset"
        value={selectedOption}
        options={prefixKeys}
        onChange={handleSelect}
      className='check'
      />
      <Button onClick={onResetPrefix} color={Button.colors.NEGATIVE} kind={Button.kinds.PRIMARY} style={{ width: '150px' }} size={Button.sizes.MEDIUM}>Reset Prefix</Button>

    </form>

  )
}
