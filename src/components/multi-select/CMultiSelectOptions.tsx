import React, { forwardRef, Fragment, HTMLAttributes, ReactNode } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { CVirtualScroller } from './../virtual-scroller'

import { getNextSibling, getPreviousSibling } from './utils'
import type { Option } from './types'

export interface CMultiSelectOptionsProps extends HTMLAttributes<HTMLDivElement> {
  handleOptionOnClick?: (option: Option) => void
  options: Option[]
  optionsMaxHeight?: number | string
  optionsStyle?: 'checkbox' | 'text'
  searchNoResultsLabel?: string | ReactNode
  selected: Option[]
  virtualScroller?: boolean
  visibleItems?: number
}

export const CMultiSelectOptions = forwardRef<HTMLDivElement, CMultiSelectOptionsProps>(
  (
    {
      handleOptionOnClick,
      options,
      optionsMaxHeight,
      optionsStyle,
      searchNoResultsLabel,
      selected,
      virtualScroller,
      visibleItems = 10,
    },
    ref,
  ) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, option: Option) => {
      if (event.code === 'Space' || event.key === 'Enter') {
        event.preventDefault()
        handleOptionOnClick && handleOptionOnClick(option)
        return
      }

      if (event.key === 'Down' || event.key === 'ArrowDown') {
        event.preventDefault()
        const target = event.target as HTMLElement
        const next = getNextSibling(target, '.form-multi-select-option')
        if (next) {
          (next as HTMLElement).focus() // eslint-disable-line prettier/prettier
        }
      }

      if (event.key === 'Up' || event.key === 'ArrowUp') {
        event.preventDefault()
        const target = event.target as HTMLElement
        const prev = getPreviousSibling(target, '.form-multi-select-option')
        if (prev) {
          (prev as HTMLElement).focus() // eslint-disable-line prettier/prettier
        }
      }
    }

    const createOptions = (options: Option[]): JSX.Element | JSX.Element[] =>
      options.length > 0 ? (
        options.map((option: Option, index: number) =>
          option.options ? (
            <Fragment key={index}>
              <div className="form-multi-select-optgroup-label">{option.label}</div>
              {createOptions(option.options)}
            </Fragment>
          ) : (
            <div
              className={classNames('form-multi-select-option', {
                'form-multi-select-option-with-checkbox': optionsStyle === 'checkbox',
                'form-multi-selected': selected.some((_option) => _option.value === option.value),
                disabled: option.disabled,
              })}
              key={index}
              onClick={() => handleOptionOnClick && handleOptionOnClick(option)}
              onKeyDown={(event) => handleKeyDown(event, option)}
              tabIndex={0}
            >
              {option.text}
            </div>
          ),
        )
      ) : (
        <div className="form-multi-select-options-empty">{searchNoResultsLabel}</div>
      )

    return virtualScroller ? (
      <CVirtualScroller className="form-multi-select-options" visibleItems={visibleItems} ref={ref}>
        {createOptions(options)}
      </CVirtualScroller>
    ) : (
      <div
        className="form-multi-select-options"
        {...(optionsMaxHeight !== 'auto' && {
          style: { maxHeight: optionsMaxHeight, overflow: 'scroll' },
        })}
        ref={ref}
      >
        {createOptions(options)}
      </div>
    )
  },
)

CMultiSelectOptions.propTypes = {
  handleOptionOnClick: PropTypes.func,
  options: PropTypes.array.isRequired,
  optionsMaxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  optionsStyle: PropTypes.oneOf(['checkbox', 'text']),
  searchNoResultsLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  virtualScroller: PropTypes.bool,
  visibleItems: PropTypes.number,
}

CMultiSelectOptions.displayName = 'CMultiSelectOptions'
