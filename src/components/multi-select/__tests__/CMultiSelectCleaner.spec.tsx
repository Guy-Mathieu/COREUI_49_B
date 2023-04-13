import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CMultiSelectCleaner } from '../CMultiSelectCleaner'

test('loads and displays CMultiSelectCleaner component', async () => {
  const { container } = render(<CMultiSelectCleaner />)
  expect(container).toMatchSnapshot()
})

test('CMultiSelectCleaner customize', async () => {
  const { container } = render(<CMultiSelectCleaner />)
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('form-multi-select-selection-cleaner')
})
