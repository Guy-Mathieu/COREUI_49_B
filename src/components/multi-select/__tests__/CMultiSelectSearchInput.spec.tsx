import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CMultiSelectSearchInput } from '../CMultiSelectSearchInput'

test('loads and displays CMultiSelectSearchInput component', async () => {
  const { container } = render(<CMultiSelectSearchInput />)
  expect(container).toMatchSnapshot()
})

test('CMultiSelectSearchInput customize', async () => {
  const { container } = render(<CMultiSelectSearchInput placeholder="some placeholder" />)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('form-multi-select-search')
  expect(container.firstChild).toHaveAttribute('type', 'text')
  expect(container.firstChild).toHaveAttribute('placeholder', 'some placeholder')
})
