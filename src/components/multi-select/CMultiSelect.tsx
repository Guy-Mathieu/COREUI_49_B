import React, {
  FormEvent,
  forwardRef,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import { CFormControlWrapper, CFormControlWrapperProps } from './../form/CFormControlWrapper'
import { CPicker } from '../picker/CPicker'

import { CMultiSelectNativeSelect } from './CMultiSelectNativeSelect'
import { CMultiSelectOptions } from './CMultiSelectOptions'
import { CMultiSelectSelection } from './CMultiSelectSelection'

import { filterOptionsList, flattenArray, selectOptions } from './utils'
import type { Option, SelectedOption } from './types'

export interface CMultiSelectProps
  extends Omit<CFormControlWrapperProps, 'floatingClassName' | 'floatingLabel'>,
    Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * Enables selection cleaner element.
   */
  cleaner?: boolean
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * It specifies that multiple options can be selected at once.
   */
  multiple?: boolean
  /**
   * Execute a function when a user changes the selected option.
   */
  onChange?: (selected: Option[]) => void
  /**
   * Execute a function when the filter value changed.
   *
   * @since 4.8.0
   */
  onFilterChange?: (value: string) => void
  /**
   * List of option elements.
   */
  options: Option[]
  /**
   * Sets maxHeight of options list.
   */
  optionsMaxHeight?: number | string
  /**
   * Sets option style.
   */
  optionsStyle?: 'checkbox' | 'text'
  /**
   * Specifies a short hint that is visible in the search input.
   */
  placeholder?: string
  /**
   * Enables search input element.
   */
  search?: boolean | 'external'
  /**
   * Sets the label for no results when filtering.
   */
  searchNoResultsLabel?: string | ReactNode
  /**
   * Enables select all button.
   */
  selectAll?: boolean
  /**
   * Sets the select all button label.
   */
  selectAllLabel?: string | ReactNode
  /**
   * Sets the selection style.
   */
  selectionType?: 'counter' | 'tags' | 'text'
  /**
   * Sets the counter selection label.
   */
  selectionTypeCounterText?: string
  /**
   * Size the component small or large.
   */
  size?: 'sm' | 'lg'
  /**
   * Enable virtual scroller for the options list.
   *
   * @since 4.8.0
   */
  virtualScroller?: boolean
  /**
   * Toggle the visibility of multi select dropdown.
   */
  visible?: boolean
  /**
   *
   * Amount of visible items when virtualScroller is set to `true`.
   *
   * @since 4.8.0
   */
  visibleItems?: number
}

export const CMultiSelect = forwardRef<HTMLDivElement, CMultiSelectProps>(
  (
    {
      className,
      cleaner = true,
      disabled,
      feedback,
      feedbackInvalid,
      feedbackValid,
      multiple = true,
      id,
      invalid,
      label,
      onChange,
      onFilterChange,
      options,
      optionsMaxHeight = 'auto',
      optionsStyle = 'checkbox',
      placeholder = 'Select...',
      search = true,
      searchNoResultsLabel = 'No results found',
      selectAll = true,
      selectAllLabel = 'Select all options',
      selectionType = 'tags',
      selectionTypeCounterText = 'item(s) selected',
      size,
      text,
      tooltipFeedback,
      valid,
      virtualScroller,
      visible = false,
      visibleItems = 10,
      ...rest
    },
    ref,
  ) => {
    const isInitialMount = useRef(true)
    const nativeSelectRef = useRef<HTMLSelectElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)

    const [_options, setOptions] = useState<Option[]>(options)
    const [_search, setSearch] = useState('')
    const [_visible, setVisible] = useState(visible)
    const [selected, setSelected] = useState<SelectedOption[]>([])

    useMemo(() => {
      setOptions(options)
      const _selected =
        options &&
        flattenArray(options).filter((option: Option) => {
          if (option.selected) {
            return option
          }

          return
        })

      const deselected =
        options &&
        flattenArray(options).filter((option: Option) => {
          if (option.selected === false) {
            return option
          }

          return
        })

      _selected && setSelected(selectOptions(_selected, selected, deselected))
    }, [JSON.stringify(options)])

    useEffect(() => {
      !isInitialMount.current &&
        nativeSelectRef.current &&
        nativeSelectRef.current.dispatchEvent(new Event('change', { bubbles: true }))
    }, [JSON.stringify(selected)])

    useEffect(() => {
      isInitialMount.current = false
    }, [])

    const handleSearchChange = (event: FormEvent<HTMLInputElement>) => {
      const target = event.target as HTMLInputElement
      if (search !== 'external') {
        setSearch(target.value.toLowerCase())
      }

      onFilterChange && onFilterChange(target.value)
    }

    const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (_search.length > 0) {
        return
      }

      if (event.key === 'Backspace' || event.key === 'Delete') {
        const last = selected.filter((option: Option) => !option.disabled).pop()
        last && setSelected(selected.filter((option: Option) => option.value !== last.value))
      }
    }

    const handleOptionOnClick = (option: Option) => {
      if (!multiple) {
        setSelected([{ value: option.value, text: option.text }] as SelectedOption[])
        setVisible(false)
        setSearch('')
        if (searchRef.current) {
          searchRef.current.value = ''
        }

        return
      }

      if (selected.some((_option) => _option.value === option.value)) {
        setSelected(selected.filter((_option) => _option.value !== option.value))
      } else {
        setSelected([...selected, { value: option.value, text: option.text }] as SelectedOption[])
      }
    }

    const handleSelectAll = () => {
      setSelected(
        selectOptions(
          flattenArray(options).filter((option: Option) => !option.disabled),
          selected,
        ),
      )
    }

    const handleDeselectAll = () => {
      setSelected(selected.filter((option) => option.disabled))
    }

    return (
      <CFormControlWrapper
        describedby={rest['aria-describedby']}
        feedback={feedback}
        feedbackInvalid={feedbackInvalid}
        feedbackValid={feedbackValid}
        id={id}
        invalid={invalid}
        label={label}
        text={text}
        tooltipFeedback={tooltipFeedback}
        valid={valid}
      >
        <CMultiSelectNativeSelect
          multiple={multiple}
          options={selected}
          value={
            multiple
              ? selected.map((option: SelectedOption) => option.value.toString())
              : selected.map((option: SelectedOption) => option.value)[0]
          }
          onChange={() => onChange && onChange(selected)}
          ref={nativeSelectRef}
        />
        <CPicker
          className={classNames(
            'form-multi-select',
            {
              'form-multi-select-with-cleaner': cleaner,
              [`form-multi-select-${size}`]: size,
              show: _visible,
              'form-multi-select-selection-tags': multiple && selectionType === 'tags',
              disabled,
              'is-invalid': invalid,
              'is-valid': valid,
            },
            className,
          )}
          disabled={disabled}
          id={id}
          onHide={() => setVisible(false)}
          onShow={() => {
            searchRef.current && searchRef.current.focus()
            setVisible(true)
          }}
          toggler={
            <div>
              <CMultiSelectSelection
                multiple={multiple}
                onRemove={(option) => !disabled && handleOptionOnClick(option)}
                search={search}
                selected={selected}
                selectionType={selectionType}
                selectionTypeCounterText={selectionTypeCounterText}
              />
              {multiple && cleaner && selected.length > 0 && (
                <button
                  type="button"
                  className="form-multi-select-selection-cleaner"
                  onClick={() => handleDeselectAll()}
                ></button>
              )}
              {search && (
                <input
                  type="text"
                  className="form-multi-select-search"
                  disabled={disabled}
                  onChange={(event) => handleSearchChange(event)}
                  onKeyDown={(event) => handleSearchKeyDown(event)}
                  {...(selected.length === 0 && { placeholder: placeholder })}
                  {...(selected.length > 0 &&
                    selectionType === 'counter' && {
                      placeholder: `${selected.length} ${selectionTypeCounterText}`,
                    })}
                  {...(selected.length > 0 &&
                    !multiple && { placeholder: selected.map((option) => option.text)[0] })}
                  {...(multiple &&
                    selected.length > 0 &&
                    selectionType !== 'counter' && { size: _search.length + 2 })}
                  ref={searchRef}
                ></input>
              )}
            </div>
          }
          visible={_visible}
          ref={ref}
        >
          <>
            {multiple && selectAll && (
              <button
                type="button"
                className="form-multi-select-all"
                onClick={() => handleSelectAll()}
              >
                {selectAllLabel}
              </button>
            )}
            <CMultiSelectOptions
              handleOptionOnClick={(option) => !disabled && handleOptionOnClick(option)}
              options={search === 'external' ? _options : filterOptionsList(_search, _options)}
              optionsMaxHeight={optionsMaxHeight}
              optionsStyle={optionsStyle}
              searchNoResultsLabel={searchNoResultsLabel}
              selected={selected}
              virtualScroller={virtualScroller}
              visibleItems={visibleItems}
            />
          </>
        </CPicker>
      </CFormControlWrapper>
    )
  },
)

CMultiSelect.propTypes = {
  className: PropTypes.string,
  cleaner: PropTypes.bool,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.array.isRequired,
  optionsMaxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  optionsStyle: PropTypes.oneOf(['checkbox', 'text']),
  placeholder: PropTypes.string,
  search: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf<'external'>(['external'])]),
  searchNoResultsLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  selectAll: PropTypes.bool,
  selectAllLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  selectionType: PropTypes.oneOf(['counter', 'tags', 'text']),
  selectionTypeCounterText: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
  virtualScroller: PropTypes.bool,
  visible: PropTypes.bool,
  visibleItems: PropTypes.number,
  ...CFormControlWrapper.propTypes,
}

CMultiSelect.displayName = 'CMultiSelect'
