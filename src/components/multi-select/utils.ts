import type { Option, SelectedOption } from './types'

export const filterOptionsList = (search: string, _options: Option[]) => {
  return search.length > 0
    ? _options &&
        _options.reduce((acc: Option[], val: Option) => {
          const options =
            val.options &&
            val.options.filter(
              (element) =>
                element.text && element.text.toLowerCase().includes(search.toLowerCase()),
            )

          if (
            (val.text && val.text.toLowerCase().includes(search.toLowerCase())) ||
            (options && options.length > 0)
          ) {
            acc.push(Object.assign({}, val, options && options.length > 0 && { options }))
          }

          return acc
        }, [])
    : _options
}

export const flattenArray = (options: Option[]): Option[] => {
  return options.reduce((acc: Option[], val: Option) => {
    return acc.concat(Array.isArray(val.options) ? flattenArray(val.options) : val)
  }, [])
}

export const getNextSibling = (elem: HTMLElement, selector?: string) => {
  // Get the next sibling element
  let sibling = elem.nextElementSibling

  // If there's no selector, return the first sibling
  if (!selector) return sibling

  // If the sibling matches our selector, use it
  // If not, jump to the next sibling and continue the loop
  while (sibling) {
    if (sibling.matches(selector)) return sibling
    sibling = sibling.nextElementSibling
  }

  return
}

export const getPreviousSibling = (elem: HTMLElement, selector?: string) => {
  // Get the next sibling element
  let sibling = elem.previousElementSibling

  // If there's no selector, return the first sibling
  if (!selector) return sibling

  // If the sibling matches our selector, use it
  // If not, jump to the next sibling and continue the loop
  while (sibling) {
    if (sibling.matches(selector)) return sibling
    sibling = sibling.previousElementSibling
  }

  return
}

export const selectOptions = (
  options: Option[],
  selected: SelectedOption[],
  deselected?: Option[],
) => {
  let _selected = [...selected, ...options]

  if (deselected) {
    _selected = _selected.filter(
      (selectedOption) =>
        !deselected.some((deselectedOption) => deselectedOption.value === selectedOption.value),
    )
  }

  const deduplicated = _selected.reduce((unique: Option[], option) => {
    if (!unique.some((obj) => obj.value === option.value)) {
      unique.push({
        value: option.value,
        text: option.text,
        ...(option.disabled && { disabled: option.disabled }),
      })
    }
    return unique
  }, []) as SelectedOption[]

  return deduplicated
}
