import React, { forwardRef, HTMLAttributes } from 'react'
import PropTypes from 'prop-types'

import type { SelectedOption } from './types'

export interface CMultiSelectSelectionProps extends HTMLAttributes<HTMLSpanElement> {
  multiple?: boolean
  onRemove?: (option: SelectedOption) => void
  search?: boolean | 'external'
  selected?: SelectedOption[]
  selectionType?: 'counter' | 'tags' | 'text'
  selectionTypeCounterText?: string
}

export const CMultiSelectSelection = forwardRef<HTMLSpanElement, CMultiSelectSelectionProps>(
  ({ multiple, onRemove, search, selected = [], selectionType, selectionTypeCounterText }, ref) => {
    return (
      <span className="form-multi-select-selection" ref={ref}>
        {multiple &&
          selectionType === 'counter' &&
          !search &&
          `${selected.length} ${selectionTypeCounterText}`}
        {multiple &&
          selectionType === 'tags' &&
          selected.map((option: SelectedOption, index: number) => {
            if (selectionType === 'tags') {
              return (
                <span className="form-multi-select-tag" key={index}>
                  {option.text}
                  {!option.disabled && (
                    <button
                      className="form-multi-select-tag-delete close"
                      aria-label="Close"
                      onClick={() => onRemove && onRemove(option)}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  )}
                </span>
              )
            }
            return
          })}
        {multiple && selectionType === 'text' && selected.map((option) => option.text).join(', ')}
        {!multiple && !search && selected.map((option) => option.text)[0]}
      </span>
    )
  },
)

CMultiSelectSelection.propTypes = {
  multiple: PropTypes.bool,
  onRemove: PropTypes.func,
  search: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf<'external'>(['external'])]),
  selected: PropTypes.array,
  selectionType: PropTypes.oneOf(['counter', 'tags', 'text']),
  selectionTypeCounterText: PropTypes.string,
}

CMultiSelectSelection.displayName = 'CMultiSelectSelection'
