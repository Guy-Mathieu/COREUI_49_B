import React, { forwardRef, ReactNode, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { CFormInput, CFormSelect, CInputGroup, CInputGroupText } from '../form'
import { CFormControlWrapper, CFormControlWrapperProps } from '../form/CFormControlWrapper'
import { CPicker, CPickerProps } from './../picker/CPicker'

import { CTimePickerRollCol } from './CTimePickerRollCol'
import {
  convert12hTo24h,
  convertTimeToDate,
  getAmPm,
  getLocalizedTimePartials,
  getSelectedHour,
  getSelectedMinutes,
  getSelectedSeconds,
  isValidTime,
} from './utils'

import type { LocalizedTimePartials } from './types'

export interface CTimePickerProps
  extends Omit<CFormControlWrapperProps, 'floatingLabel'>,
    Omit<
      CPickerProps,
      'autoClose' | 'component' | 'dark' | 'placeholder' | 'variant' | 'onChange'
    > {
  /**
   * Set if the component should use the 12/24 hour format. If `true` forces the interface to a 12-hour format. If `false` forces the interface into a 24-hour format. If `auto` the current locale will determine the 12 or 24-hour interface by default locales.
   *
   * @since 4.8.0
   */
  ampm?: 'auto' | boolean
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Toggle visibility or set the content of the cleaner button.
   */
  cleaner?: ReactNode | boolean
  /**
   * Toggle visibility or set the content of the input indicator.
   */
  indicator?: ReactNode | boolean
  /**
   * Toggle the readonly state for the component.
   */
  inputReadOnly?: boolean
  /**
   * Sets the default locale for components. If not set, it is inherited from the browser.
   */
  locale?: string
  /**
   * Callback fired when the time changed.
   */
  onTimeChange?: (timeString: string | null, localeTimeString?: string, date?: Date) => void
  /**
   * Specifies a short hint that is visible in the input.
   */
  placeholder?: string
  /**
   * Show seconds.
   *
   * @since 4.8.0
   */
  seconds?: boolean
  /**
   * Size the component small or large.
   */
  size?: 'sm' | 'lg'
  /**
   * Initial selected time.
   */
  time?: Date | string | null
  /**
   * Set the time picker variant to a roll or select.
   */
  variant?: 'roll' | 'select'
}

export const CTimePicker = forwardRef<HTMLDivElement | HTMLLIElement, CTimePickerProps>(
  (
    {
      ampm = 'auto',
      className,
      cleaner = true,
      container = 'dropdown',
      disabled,
      feedback,
      feedbackInvalid,
      feedbackValid,
      footer = true,
      id,
      indicator = true,
      inputReadOnly,
      invalid,
      label,
      locale = 'default',
      onTimeChange,
      onHide,
      onShow,
      placeholder = 'Select time',
      seconds = true,
      size,
      text,
      time,
      tooltipFeedback,
      valid,
      variant = 'roll',
      visible,
      ...rest
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [date, setDate] = useState<Date | null>(convertTimeToDate(time))
    const [initialDate, setInitialDate] = useState<Date | null>(null)
    const [_ampm, setAmPm] = useState<'am' | 'pm'>(date ? getAmPm(new Date(date), locale) : 'am')
    const [_visible, setVisible] = useState(visible)

    const [localizedTimePartials, setLocalizedTimePartials] = useState<LocalizedTimePartials>({
      listOfHours: [],
      listOfMinutes: [],
      listOfSeconds: [],
      hour12: false,
    })

    useEffect(() => {
      setDate(convertTimeToDate(time))
    }, [time])

    useEffect(() => {
      setLocalizedTimePartials(getLocalizedTimePartials(locale, ampm))

      if (inputRef.current) {
        inputRef.current.value = date
          ? date.toLocaleTimeString(locale, {
              hour12: localizedTimePartials && localizedTimePartials.hour12,
              ...(!seconds && { timeStyle: 'short' }),
            })
          : ''
      }

      date && setAmPm(getAmPm(new Date(date), locale))
    }, [date])

    const handleClear = (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation()
      setDate(null)
      onTimeChange && onTimeChange(null)
    }

    const handleTimeChange = (set: 'hours' | 'minutes' | 'seconds' | 'toggle', value: string) => {
      const _date = date || new Date('1970-01-01')

      if (set === 'toggle') {
        if (value === 'am') {
          _date.setHours(_date.getHours() - 12)
        }
        if (value === 'pm') {
          _date.setHours(_date.getHours() + 12)
        }
      }

      if (set === 'hours') {
        if (localizedTimePartials && localizedTimePartials.hour12) {
          _date.setHours(convert12hTo24h(_ampm, Number.parseInt(value)))
        } else {
          _date.setHours(Number.parseInt(value))
        }
      }

      if (set === 'minutes') {
        _date.setMinutes(Number.parseInt(value))
      }

      if (set === 'seconds') {
        _date.setSeconds(Number.parseInt(value))
      }

      setDate(new Date(_date))
      onTimeChange && onTimeChange(_date.toTimeString(), _date.toLocaleTimeString(), _date)
    }

    const InputGroup = () => (
      <CInputGroup className="picker-input-group" size={size}>
        <CFormInput
          autoComplete="off"
          delay={true}
          disabled={disabled}
          onChange={(event) =>
            isValidTime(event.target.value) && setDate(convertTimeToDate(event.target.value))
          }
          placeholder={placeholder}
          readOnly={inputReadOnly}
          ref={inputRef}
        />
        {(indicator || cleaner) && (
          <CInputGroupText>
            {indicator && (
              <span className="picker-input-group-indicator">
                {typeof indicator === 'boolean' ? (
                  <span className="picker-input-group-icon time-picker-input-icon" />
                ) : (
                  indicator
                )}
              </span>
            )}
            {cleaner && date && (
              <span
                className="picker-input-group-cleaner"
                role="button"
                onClick={(event) => handleClear(event)}
              >
                {typeof cleaner === 'boolean' ? (
                  <span className="picker-input-group-icon time-picker-cleaner-icon" />
                ) : (
                  cleaner
                )}
              </span>
            )}
          </CInputGroupText>
        )}
      </CInputGroup>
    )

    const TimePickerSelect = () => {
      return (
        <>
          <span className="time-picker-inline-icon" />
          <CFormSelect
            disabled={disabled}
            options={
              localizedTimePartials &&
              localizedTimePartials.listOfHours?.map((option) => {
                return {
                  value: option.value.toString(),
                  label: option.label,
                }
              })
            }
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              handleTimeChange('hours', event.target.value)
            }
            value={getSelectedHour(date, locale)}
          />
          <>:</>
          <CFormSelect
            disabled={disabled}
            options={
              localizedTimePartials &&
              localizedTimePartials.listOfMinutes.map((option) => {
                return {
                  value: option.value.toString(),
                  label: option.label,
                }
              })
            }
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              handleTimeChange('minutes', event.target.value)
            }
            value={getSelectedMinutes(date)}
          />
          {seconds && (
            <>
              <>:</>
              <CFormSelect
                disabled={disabled}
                options={
                  localizedTimePartials &&
                  localizedTimePartials.listOfSeconds.map((option) => {
                    return {
                      value: option.value.toString(),
                      label: option.label,
                    }
                  })
                }
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  handleTimeChange('seconds', event.target.value)
                }
                value={getSelectedSeconds(date)}
              />
            </>
          )}
          {localizedTimePartials && localizedTimePartials.hour12 && (
            <CFormSelect
              disabled={disabled}
              options={[
                { value: 'am', label: 'AM' },
                { value: 'pm', label: 'PM' },
              ]}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                handleTimeChange('toggle', event.target.value)
              }
              value={_ampm}
            />
          )}
        </>
      )
    }

    const TimePickerRoll = () => (
      <>
        <CTimePickerRollCol
          elements={localizedTimePartials && localizedTimePartials.listOfHours}
          onClick={(index: number) => handleTimeChange('hours', index.toString())}
          selected={getSelectedHour(date, locale, ampm)}
        />
        <CTimePickerRollCol
          elements={localizedTimePartials && localizedTimePartials.listOfMinutes}
          onClick={(index: number) => handleTimeChange('minutes', index.toString())}
          selected={getSelectedMinutes(date)}
        />
        {seconds && (
          <CTimePickerRollCol
            elements={localizedTimePartials && localizedTimePartials.listOfSeconds}
            onClick={(index: number) => handleTimeChange('seconds', index.toString())}
            selected={getSelectedSeconds(date)}
          />
        )}
        {localizedTimePartials && localizedTimePartials.hour12 && (
          <CTimePickerRollCol
            elements={[
              { value: 'am', label: 'AM' },
              { value: 'pm', label: 'PM' },
            ]}
            onClick={(value: string) => handleTimeChange('toggle', value)}
            selected={_ampm}
          />
        )}
      </>
    )

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
        <CPicker
          className={classNames(
            'time-picker',
            {
              'is-invalid': invalid,
              'is-valid': valid,
            },
            className,
          )}
          container={container}
          disabled={disabled}
          footer={footer}
          id={id}
          onCancel={() => {
            initialDate && setDate(new Date(initialDate))
            setVisible(false)
          }}
          onHide={() => {
            setVisible(false)
            onHide && onHide()
          }}
          onShow={() => {
            date && setInitialDate(new Date(date))
            setVisible(true)
            onShow && onShow()
          }}
          toggler={InputGroup()}
          visible={_visible}
          {...rest}
          ref={ref}
        >
          <div
            className={classNames('time-picker-body', {
              ['time-picker-roll']: variant === 'roll',
            })}
          >
            {variant === 'select' ? <TimePickerSelect /> : TimePickerRoll()}
          </div>
        </CPicker>
      </CFormControlWrapper>
    )
  },
)

CTimePicker.propTypes = {
  ...CFormControlWrapper.propTypes,
  ...CPicker.propTypes,
  ampm: PropTypes.oneOfType([PropTypes.oneOf<'auto'>(['auto']), PropTypes.bool]),
  className: PropTypes.string,
  locale: PropTypes.string,
  onTimeChange: PropTypes.func,
  seconds: PropTypes.bool,
  time: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  variant: PropTypes.oneOf(['roll', 'select']),
}

CTimePicker.displayName = 'CTimePicker'
