export type Option = {
  disabled?: boolean
  label?: string
  options?: Option[]
  order?: number
  selected?: boolean
  text: string
  value: number | string
}

export type SelectedOption = {
  disabled?: boolean
  text: string
  value: number | string
}
