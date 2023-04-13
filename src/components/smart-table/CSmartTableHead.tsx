import React, { ElementType, forwardRef, ReactNode, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import { CFormCheck, CFormInput } from '../form'
import { CTableHeaderCell, CTableRow } from '../table'
import { CTableHead, CTableHeadProps } from '../table/CTableHead'

import {
  getColumnKey,
  getColumnLabel,
  getColumnSorterState,
  getColumnValues,
  getTableHeaderCellProps,
  getTableHeaderCellStyles,
} from './utils'

import type { ColumnFilter, ColumnFilterValue, Column, Item, Sorter, SorterValue } from './types'

export interface CSmartTableHeadProps extends CTableHeadProps {
  columnFilter?: boolean | ColumnFilter
  columnFilterState?: ColumnFilterValue
  columnSorter?: boolean | Sorter
  component?: string | ElementType
  columns: (Column | string)[]
  handleOnCustomFilterChange?: (key: string, value: any) => void
  handleFilterOnChange?: (key: string, value: string) => void
  handleFilterOnInput?: (key: string, value: string) => void
  handleSelectAllChecked?: () => void
  handleSort?: (key: string, index: number) => void
  items: Item[]
  selectable?: boolean
  selectAll?: boolean | { external?: boolean }
  selectedAll?: boolean | string
  sorterState?: SorterValue
  sortingIcon?: ReactNode
  sortingIconAscending?: ReactNode
  sortingIconDescending?: ReactNode
}

export const CSmartTableHead = forwardRef<HTMLTableSectionElement, CSmartTableHeadProps>(
  (
    {
      columnFilter,
      columnFilterState,
      columnSorter,
      component: Component = CTableHead,
      columns,
      handleOnCustomFilterChange,
      handleFilterOnChange,
      handleFilterOnInput,
      handleSelectAllChecked,
      handleSort,
      items,
      selectable,
      selectAll,
      selectedAll,
      sorterState,
      sortingIcon,
      sortingIconAscending,
      sortingIconDescending,
      ...rest
    },
    ref,
  ) => {
    const selectAllcheckboxRef = useRef<HTMLInputElement>(null)
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
      if (selectedAll === 'indeterminate') {
        if (selectAllcheckboxRef.current) selectAllcheckboxRef.current.indeterminate = true
      } else {
        if (selectAllcheckboxRef.current) selectAllcheckboxRef.current.indeterminate = false
      }
    }, [selectedAll])

    useEffect(() => {
      if (columnFilterState && Object.keys(columnFilterState).length === 0) {
        setRefresh(true)
      }
    }, [columnFilterState])

    useEffect(() => {
      setRefresh(true)
    }, [items])

    useEffect(() => {
      if (setRefresh) {
        setRefresh(false)
      }
    }, [refresh])

    const columnSorterIcon = (column: Column | string) => {
      if (getColumnSorterState(getColumnKey(column), sorterState) === 0) {
        return <span className="opacity-25 float-end me-1">{sortingIcon}</span>
      }

      if (getColumnSorterState(getColumnKey(column), sorterState) === 'asc') {
        return <span className="float-end me-1">{sortingIconAscending}</span>
      }

      if (getColumnSorterState(getColumnKey(column), sorterState) === 'desc') {
        return <span className="float-end me-1">{sortingIconDescending}</span>
      }

      return
    }

    return (
      <Component {...rest} ref={ref}>
        <CTableRow>
          {selectable && (
            <CTableHeaderCell>
              {selectAll && (
                <CFormCheck
                  checked={typeof selectedAll === 'boolean' ? selectedAll : false}
                  onChange={() => handleSelectAllChecked && handleSelectAllChecked()}
                  ref={selectAllcheckboxRef}
                />
              )}
            </CTableHeaderCell>
          )}
          {columns.map((column: Column | string, index: number) => {
            return (
              <CTableHeaderCell
                {...getTableHeaderCellProps(column)}
                onClick={() => handleSort && handleSort(getColumnKey(column), index)}
                style={getTableHeaderCellStyles(column, columnSorter)}
                key={index}
              >
                <div className="d-inline">{getColumnLabel(column)}</div>
                {columnSorter &&
                  (typeof column !== 'object'
                    ? true
                    : typeof column.sorter === 'undefined'
                    ? true
                    : column.sorter) &&
                  columnSorterIcon(column)}
              </CTableHeaderCell>
            )
          })}
        </CTableRow>
        {columnFilter && (
          <CTableRow>
            {selectable && <CTableHeaderCell></CTableHeaderCell>}
            {columns.map((column: Column | string, index: number) => {
              return (
                <CTableHeaderCell {...getTableHeaderCellProps(column)} key={index}>
                  {(
                    typeof column !== 'object'
                      ? true
                      : typeof column.filter === 'undefined'
                      ? true
                      : column.filter
                  ) ? (
                    typeof column !== 'string' && typeof column.filter === 'function' ? (
                      !refresh &&
                      column.filter(
                        getColumnValues(items, getColumnKey(column)),
                        (value: any) =>
                          handleOnCustomFilterChange &&
                          handleOnCustomFilterChange(getColumnKey(column), value),
                      )
                    ) : (
                      <CFormInput
                        size="sm"
                        onInput={(event) =>
                          handleFilterOnInput &&
                          handleFilterOnInput(
                            getColumnKey(column),
                            (event.target as HTMLInputElement).value,
                          )
                        }
                        onChange={(event) =>
                          handleFilterOnChange &&
                          handleFilterOnChange(
                            getColumnKey(column),
                            (event.target as HTMLInputElement).value,
                          )
                        }
                        value={
                          columnFilterState && columnFilterState[getColumnKey(column)]
                            ? columnFilterState[getColumnKey(column)]
                            : ''
                        }
                        aria-label={`column name: '${getColumnLabel(column)}' filter input`}
                      />
                    )
                  ) : (
                    ''
                  )}
                </CTableHeaderCell>
              )
            })}
          </CTableRow>
        )}
      </Component>
    )
  },
)

CSmartTableHead.propTypes = {
  columnFilter: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  columnFilterState: PropTypes.object,
  columnSorter: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  component: PropTypes.elementType,
  children: PropTypes.node,
  columns: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.any, PropTypes.string])).isRequired, // TODO: improve this Prop Type,
  handleFilterOnChange: PropTypes.func,
  handleFilterOnInput: PropTypes.func,
  handleSelectAllChecked: PropTypes.func,
  handleSort: PropTypes.func,
  selectable: PropTypes.bool,
  selectAll: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  selectedAll: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  sorterState: PropTypes.object,
  sortingIcon: PropTypes.node,
  sortingIconAscending: PropTypes.node,
  sortingIconDescending: PropTypes.node,
}

CSmartTableHead.displayName = 'CSmartTableHead'
