import React, { forwardRef, ReactNode, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { CButton } from '../button/CButton'
import { CDropdown, CDropdownProps } from '../dropdown/CDropdown'
import { CDropdownMenu } from '../dropdown/CDropdownMenu'
import { CDropdownToggle } from '../dropdown/CDropdownToggle'

import { Colors } from '../../types'

export interface CPickerProps extends Omit<CDropdownProps, 'variant'> {
  /**
   * Toggle visibility or set the content of cancel button.
   *
   * @default 'Cancel'
   */
  cancelButton?: boolean | ReactNode
  /**
   * Sets the color context of the cancel button to one of CoreUI’s themed colors.
   *
   * @type 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | string
   * @default 'primary'
   */
  cancelButtonColor?: Colors
  /**
   * Size the cancel button small or large.
   *
   * @default 'sm'
   */
  cancelButtonSize?: 'sm' | 'lg'
  /**
   * Set the cancel button variant to an outlined button or a ghost button.
   *
   * @default 'ghost'
   */
  cancelButtonVariant?: 'outline' | 'ghost'
  /**
   * Toggle visibility or set the content of confirm button.
   *
   * @default 'OK'
   */
  confirmButton?: boolean | ReactNode
  /**
   * Sets the color context of the confirm button to one of CoreUI’s themed colors.
   *
   * @type 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | string
   * @default 'primary'
   */
  confirmButtonColor?: Colors
  /**
   * Size the confirm button small or large.
   *
   * @default 'sm'
   */
  confirmButtonSize?: 'sm' | 'lg'
  /**
   * Set the confirm button variant to an outlined button or a ghost button.
   */
  confirmButtonVariant?: 'outline' | 'ghost'
  /**
   * Set container type for the component.
   */
  container?: 'dropdown' | 'inline'
  /**
   * Toggle the disabled state for the component.
   */
  disabled?: boolean
  /**
   * Toggle visibility of footer element or set the content of footer.
   */
  footer?: boolean | ReactNode
  /**
   * Add custom elements to the footer.
   */
  footerContent?: ReactNode
  /**
   * Callback fired when the cancel button has been clicked.
   */
  onCancel?: () => void
  /**
   * Callback fired when the confirm button has been clicked.
   */
  onConfirm?: () => void
  /**
   * The content of toggler.
   */
  toggler?: ReactNode
}

export const CPicker = forwardRef<HTMLDivElement | HTMLLIElement, CPickerProps>(
  (
    {
      children,
      cancelButton = 'Cancel',
      cancelButtonColor = 'primary',
      cancelButtonSize = 'sm',
      cancelButtonVariant = 'ghost',
      confirmButton = 'OK',
      confirmButtonColor = 'primary',
      confirmButtonSize = 'sm',
      confirmButtonVariant,
      className,
      container = 'dropdown',
      disabled,
      footer,
      footerContent,
      onCancel,
      onConfirm,
      onHide,
      onShow,
      toggler: Toggler,
      visible,
      ...rest
    },
    ref,
  ) => {
    const [_visible, setVisible] = useState(visible)

    useEffect(() => {
      setVisible(visible)
    }, [visible])

    const Footer = () => (
      <>
        {footerContent}
        {cancelButton && (
          <CButton
            color={cancelButtonColor}
            size={cancelButtonSize}
            variant={cancelButtonVariant}
            onClick={() => onCancel && onCancel()}
          >
            {cancelButton}
          </CButton>
        )}
        {confirmButton && (
          <CButton
            color={confirmButtonColor}
            size={confirmButtonSize}
            variant={confirmButtonVariant}
            onClick={() => {
              onConfirm && onConfirm()
              setVisible(false)
            }}
          >
            {confirmButton}
          </CButton>
        )}
      </>
    )

    switch (container) {
      case 'inline': {
        return <div className={classNames('picker', className)}>{children}</div>
      }
      default: {
        return (
          <CDropdown
            autoClose="outside"
            className={classNames('picker', className)}
            onHide={() => {
              setVisible(false)
              onHide && onHide()
            }}
            onShow={() => {
              setVisible(true)
              onShow && onShow()
            }}
            variant="dropdown"
            visible={_visible}
            {...rest}
            ref={ref}
          >
            <CDropdownToggle custom disabled={_visible || disabled}>
              {Toggler}
            </CDropdownToggle>
            <CDropdownMenu component="div">
              {children}
              {footer && (
                <div className="picker-footer">
                  {typeof footer === 'boolean' ? Footer() : footer}
                </div>
              )}
            </CDropdownMenu>
          </CDropdown>
        )
      }
    }
  },
)

CPicker.displayName = 'CPicker'

CPicker.propTypes = {
  cancelButton: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  cancelButtonColor: CButton.propTypes?.color,
  cancelButtonSize: CButton.propTypes?.size,
  cancelButtonVariant: CButton.propTypes?.variant,
  confirmButton: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  confirmButtonColor: CButton.propTypes?.color,
  confirmButtonSize: CButton.propTypes?.size,
  confirmButtonVariant: CButton.propTypes?.variant,
  children: PropTypes.node,
  className: PropTypes.string,
  container: PropTypes.oneOf(['dropdown', 'inline']),
  disabled: PropTypes.bool,
  footer: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  footerContent: PropTypes.node,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  toggler: PropTypes.node,
  ...CDropdown.propTypes,
}
