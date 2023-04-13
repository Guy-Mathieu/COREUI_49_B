import * as React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { CMultiSelectSelectAllButton } from '../CMultiSelectSelectAllButton'

test('loads and displays CMultiSelectSelectAllButton component', async () => {
  const { container } = render(<CMultiSelectSelectAllButton>text</CMultiSelectSelectAllButton>)
  expect(container).toMatchSnapshot()
})

test('CMultiSelectSelectAllButton customize', async () => {
  const { container } = render(
    <CMultiSelectSelectAllButton placeholder="some placeholder">
      bazinga
    </CMultiSelectSelectAllButton>,
  )
  expect(container).toMatchSnapshot()
  expect(container.firstChild).toHaveClass('form-multi-select-all')
  expect(container.firstChild).toHaveAttribute('type', 'button')
  expect(container.firstChild).toHaveTextContent('bazinga')
})
