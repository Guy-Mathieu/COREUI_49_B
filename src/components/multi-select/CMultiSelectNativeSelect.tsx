import React, { forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'

import type { Option } from './types'

export interface CMultiSelectNativeSelectProps
  extends Omit<HTMLAttributes<HTMLSelectElement>, 'options'> {
  multiple?: boolean
  options: Option[] | undefined
  value?: string | number | readonly string[]
}

export const CMultiSelectNativeSelect = forwardRef<
  HTMLSelectElement,
  CMultiSelectNativeSelectProps
>(({ multiple, options, ...rest }, ref) => {
  const createNativeOptions = (options: Option[]) => {
    return options.map((option: Option, index: number) => {
      return option.options ? (
        <optgroup label={option.label} key={index}>
          {createNativeOptions(option.options)}
        </optgroup>
      ) : (
        <option value={option.value} key={index} disabled={option.disabled}>
          {option.text}
        </option>
      )
    })
  }

  return (
    <select multiple={multiple} tabIndex={-1} style={{ display: 'none' }} {...rest} ref={ref}>
      {options && createNativeOptions(options)}
    </select>
  )
})

CMultiSelectNativeSelect.propTypes = {
  multiple: PropTypes.any, // TODO: update
  options: PropTypes.array.isRequired,
  value: PropTypes.any, // TODO: update
}

CMultiSelectNativeSelect.displayName = 'CMultiSelectNativeSelect'
