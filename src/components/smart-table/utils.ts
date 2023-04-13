import type {
  Column,
  ColumnFilter,
  ColumnFilterValue,
  Item,
  Sorter,
  SorterValue,
  TableFilter,
} from './types'

export const filterColumns = (
  items: Item[],
  columnFilter: boolean | ColumnFilter | undefined,
  columnFilterState: ColumnFilterValue,
  itemsDataColumns: string[],
) => {
  if (columnFilter && typeof columnFilter === 'object' && columnFilter.external) {
    return items
  }

  Object.entries(columnFilterState).forEach(([key, value]) => {
    if (value instanceof Function) {
      items = items.filter((item) => value(item[key]))
      return
    }

    const columnFilter = String(value).toLowerCase()
    if (columnFilter && itemsDataColumns.includes(key)) {
      items = items.filter((item) => {
        return String(item[key]).toLowerCase().includes(columnFilter)
      })
    }
  })

  return items
}

export const filterTable = (
  items: Item[],
  tableFilter: boolean | TableFilter | undefined,
  tableFilterState: string,
  itemsDataColumns: string[],
) => {
  if (
    !tableFilterState ||
    (tableFilter && typeof tableFilter === 'object' && tableFilter.external)
  ) {
    return items
  }

  const filter = tableFilterState.toLowerCase()
  const valueContainFilter = (val: any) => String(val).toLowerCase().includes(filter)
  items = items.filter((item) => {
    return !!itemsDataColumns.find((key) => valueContainFilter(item[key]))
  })

  return items
}

export const getClickedColumnName = (
  target: HTMLTextAreaElement,
  columnNames: string[],
): string => {
  const closest = target.closest('tr')
  const children = closest ? Array.from(closest.children) : []
  const clickedCell = children.filter((child) => child.contains(target))[0]
  return columnNames[children.indexOf(clickedCell)]
}

export const getColumnKey = (column: Column | string) =>
  typeof column === 'object' ? column.key : column

export const getColumnLabel = (column: Column | string) =>
  typeof column === 'object'
    ? column.label !== undefined
      ? column.label
      : pretifyName(column.key)
    : pretifyName(column)

export const getColumnNames = (columns: (string | Column)[] | undefined, items: Item[]) =>
  columns
    ? columns.map((column: Column | string) => {
        return typeof column === 'object' ? column.key : column
      })
    : getColumnNamesFromItems(items)

export const getColumnNamesFromItems = (items: Item[]) =>
  Object.keys(items[0] || {}).filter((el) => el.charAt(0) !== '_')

export const getColumnSorterState = (
  key: string,
  sorterState: SorterValue | undefined,
): string | number => {
  if (sorterState && sorterState.column === key) {
    if (sorterState.state) {
      return sorterState.state
    }
    return 0
  }

  return 0
}

export const getColumnValues = (items: Item[], key: string) => {
  return items.map((item) => item[key])
}

export const getTableDataCellProps = (item: Item, colName: string) => {
  const props = item._cellProps && {
    ...(item._cellProps['all'] && { ...item._cellProps['all'] }),
    ...(item._cellProps[colName] && { ...item._cellProps[colName] }),
  }

  return props
}

export const getTableHeaderCellProps = (column: Column | string) => {
  if (typeof column === 'object' && column._props) {
    return column._props
  }

  return {}
}

export const getTableHeaderCellStyles = (
  column: Column | string,
  columnSorter: boolean | Sorter | undefined,
) => {
  const style = {}

  if (
    columnSorter &&
    (typeof column !== 'object' ||
      (typeof column === 'object' && (column.sorter === undefined || column.sorter)))
  ) {
    style['cursor'] = 'pointer'
  }

  if (typeof column === 'object' && column._style) {
    return { ...style, ...column._style }
  }
  return style
}

export const isSortable = (
  i: number,
  columns: (string | Column)[] | undefined,
  columnSorter: Sorter | boolean | undefined,
  itemsDataColumns: string[],
  columnNames: string[],
): boolean | undefined => {
  const isDataColumn = itemsDataColumns.includes(columnNames[i])
  let column
  if (columns) column = columns[i]
  return (
    columnSorter &&
    (!columns ||
      typeof column !== 'object' ||
      (typeof column === 'object' && (column.sorter === undefined || column.sorter))) &&
    isDataColumn
  )
}

export const pretifyName = (name: string) => {
  return name
    .replace(/[-_.]/g, ' ')
    .replace(/ +/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const sortItems = (
  columnSorter: boolean | Sorter | undefined,
  items: Item[],
  itemsDataColumns: string[],
  sorterState: SorterValue,
) => {
  const column = sorterState.column
  if (
    !column ||
    !itemsDataColumns.includes(column) ||
    (columnSorter && typeof columnSorter === 'object' && columnSorter.external)
  ) {
    return items
  }

  const flip = sorterState.state === 'asc' ? 1 : sorterState.state === 'desc' ? -1 : 0
  const sorted = items.slice().sort((item, item2) => {
    const value = item[column]
    const value2 = item2[column]
    const a = typeof value === 'number' ? value : String(value).toLowerCase()
    const b = typeof value2 === 'number' ? value2 : String(value2).toLowerCase()
    return a > b ? 1 * flip : b > a ? -1 * flip : 0
  })
  return sorted
}
