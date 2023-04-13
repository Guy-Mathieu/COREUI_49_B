import React, { forwardRef, KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { CButton } from '../button/CButton'

import {
  createGroupsInArray,
  getMonthDetails,
  getMonthsNames,
  getYears,
  isDateDisabled,
  isDateInRange,
  isDateSelected,
  isDisableDateInRange,
  isLastDayOfMonth,
  isSameDateAs,
  isToday,
  isStartDate,
  isEndDate,
} from './utils'

import { useStateWithCallback } from '../../hooks'

export interface CCalendarProps {
  /**
   * Default date of the component
   */
  calendarDate?: Date | string
  /**
   * The number of calendars that render on desktop devices.
   */
  calendars?: number
  /**
   * A string of all className you want applied to the component.
   */
  className?: string
  /**
   * Set the format of day name.
   *
   * @default 'numeric'
   * @since 4.3.0
   */
  dayFormat?: 'numeric' | '2-digit' | ((date: Date) => string | number)
  /**
   * Specify the list of dates that cannot be selected.
   */
  disabledDates?: Date[] | Date[][] | (Date | Date[])[]
  /**
   * Initial selected to date (range).
   */
  endDate?: Date | string | null
  /**
   * Sets the day of start week.
   * - 0 - Sunday,
   * - 1 - Monday,
   * - 2 - Tuesday,
   * - 3 - Wednesday,
   * - 4 - Thursday,
   * - 5 - Friday,
   * - 6 - Saturday,
   *
   * @default 1
   */
  firstDayOfWeek?: number
  /**
   * Sets the default locale for components. If not set, it is inherited from the browser.
   *
   * @default 'default'
   */
  locale?: string
  /**
   * Max selectable date.
   */
  maxDate?: Date | string | null
  /**
   * Min selectable date.
   */
  minDate?: Date | string | null
  /**
   * Show arrows navigation.
   */
  navigation?: boolean
  /**
   * The custom next icon.
   */
  navNextIcon?: ReactNode
  /**
   * The custom next double icon.
   */
  navNextDoubleIcon?: ReactNode
  /**
   * The custom prev icon.
   */
  navPrevIcon?: ReactNode
  /**
   * The custom prev double icon.
   */
  navPrevDoubleIcon?: ReactNode
  /**
   * Reorder year-month navigation, and render year first.
   *
   * @since 4.3.0
   */
  navYearFirst?: boolean
  /**
   * Allow range selection.
   */
  range?: boolean
  /**
   * Toggle select mode between start and end date.
   */
  selectEndDate?: boolean
  /**
   * Initial selected date.
   */
  startDate?: Date | string | null
  /**
   * Set length or format of day name.
   *
   * @default 2
   */
  weekdayFormat?: number | 'long' | 'narrow' | 'short' | ((date: Date) => string | number)
  /**
   * Callback fired when the user hovers over the calendar cell.
   */
  onCalendarCellHover?: (date: Date | null) => void
  /**
   * Callback fired when the calendar date changed.
   */
  onCalendarDateChange?: (date: Date) => void
  /**
   * Callback fired when the start date changed.
   */
  onStartDateChange?: (date: Date | null, formatedDate?: string | undefined) => void
  /**
   * Callback fired when the end date changed.
   */
  onEndDateChange?: (date: Date | null, formatedDate?: string | undefined) => void
  /**
   * Callback fired when the selection type changed.
   */
  onSelectEndChange?: (value: boolean) => void
  /**
   * Callback fired when the view type of calendar changed.
   */
  onViewChanged?: (view: string) => void
}

const Calendar = (props: {
  addMonths: number
  calendarDate: Date
  dayFormat?: 'numeric' | '2-digit' | ((date: Date) => string | number)
  disabledDates?: Date[] | Date[][] | (Date | Date[])[]
  endDate: Date | null
  firstDayOfWeek: number
  hoverDate: Date | null
  locale: string
  maxDate: Date | null
  minDate: Date | null
  onCellClick: (date: Date) => void
  onCellKeyDown: (event: KeyboardEvent<HTMLDivElement>, date: Date) => void
  onCellMouseEnter: (date: Date) => void
  onCellMouseLeave: () => void
  onMonthClick: (month: number, view: string) => void
  onYearClick: (date: Date, view: string) => void
  selectEndDate: boolean | undefined
  startDate: Date | null
  view: string
  weekdayFormat: number | 'long' | 'narrow' | 'short' | ((date: Date) => string | number)
}) => {
  const {
    addMonths,
    calendarDate,
    dayFormat,
    disabledDates,
    endDate,
    firstDayOfWeek,
    hoverDate,
    locale,
    maxDate,
    minDate,
    onCellClick,
    onCellKeyDown,
    onCellMouseEnter,
    onCellMouseLeave,
    onMonthClick,
    onYearClick,
    selectEndDate,
    startDate,
    view,
    weekdayFormat,
  } = props
  const [date, setDate] = useState<Date>(calendarDate)
  const [listOfMonths, setListOfMonths] = useState<string[][]>([])

  useEffect(() => {
    if (addMonths !== 0) {
      setDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + addMonths, 1))
      return
    }

    setDate(calendarDate)
  }, [calendarDate])

  useEffect(() => {
    setListOfMonths(createGroupsInArray(getMonthsNames(locale), 4))
  }, [])

  const monthDetails = getMonthDetails(date.getFullYear(), date.getMonth(), firstDayOfWeek)
  const listOfYears = createGroupsInArray(getYears(date.getFullYear()), 4)
  const weekDays = monthDetails[0]

  return (
    <table>
      {view === 'days' && (
        <thead>
          <tr>
            {weekDays.map(({ date }: { date: Date }, idx: number) => (
              <th key={idx} className="calendar-cell">
                <div className="calendar-header-cell-inner">
                  {typeof weekdayFormat === 'function'
                    ? weekdayFormat(date)
                    : typeof weekdayFormat === 'string'
                    ? date.toLocaleDateString(locale, { weekday: weekdayFormat })
                    : date.toLocaleDateString(locale, { weekday: 'long' }).slice(0, weekdayFormat)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {view === 'days' &&
          monthDetails.map((week, index) => {
            return (
              <tr key={index}>
                {week.map(({ date, month }: { date: Date; month: string }, idx: number) => (
                  <td
                    className={classNames('calendar-cell', {
                      today: month === 'current' && isToday(date),
                      disabled: isDateDisabled(date, minDate, maxDate, disabledDates),
                      [month]: true,
                      last: isLastDayOfMonth(date),
                      'range-hover':
                        month === 'current' &&
                        (hoverDate && selectEndDate
                          ? isDateInRange(date, startDate, hoverDate)
                          : isDateInRange(date, hoverDate, endDate)),
                      range: month === 'current' && isDateInRange(date, startDate, endDate),
                      selected: isDateSelected(date, startDate, endDate),
                      start: isStartDate(date, startDate, endDate),
                      end: isEndDate(date, startDate, endDate),
                    })}
                    key={idx}
                    tabIndex={0}
                    title={date.toLocaleDateString(locale)}
                    {...(month === 'current' && {
                      onBlur: () => onCellMouseLeave(),
                      onClick: () => onCellClick(date),
                      onFocus: () => onCellMouseEnter(date),
                      onKeyDown: (event) => onCellKeyDown(event, date),
                      onMouseEnter: () => onCellMouseEnter(date),
                      onMouseLeave: () => onCellMouseLeave(),
                    })}
                    {...(month !== 'current' && {
                      onMouseEnter: () => onCellMouseLeave(),
                    })}
                  >
                    <div className="calendar-cell-inner">
                      {typeof dayFormat === 'function'
                        ? dayFormat(date)
                        : date.toLocaleDateString(locale, { day: dayFormat })}
                    </div>
                  </td>
                ))}
              </tr>
            )
          })}
        {view === 'months' &&
          listOfMonths.map((row, index) => {
            return (
              <tr key={index}>
                {row.map((month, idx) => {
                  return (
                    <td
                      key={idx}
                      className="calendar-cell month"
                      onClick={() => onMonthClick(index * 3 + idx - addMonths, 'days')}
                    >
                      <div className="calendar-cell-inner">{month}</div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        {view === 'years' &&
          listOfYears.map((row, index) => {
            return (
              <tr key={index}>
                {row.map((year, idx) => {
                  return (
                    <td
                      key={idx}
                      className="calendar-cell year"
                      onClick={() =>
                        onYearClick(
                          new Date(year, date.getMonth() - addMonths, date.getDate()),
                          'months',
                        )
                      }
                    >
                      <div className="calendar-cell-inner">
                        {new Date(year, 0, 1).toLocaleDateString(locale, { year: 'numeric' })}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
      </tbody>
    </table>
  )
}

const Navigation = (props: {
  addMonths: number
  calendarDate: Date
  locale: string
  navigation: boolean
  navNextDoubleIcon: ReactNode
  navNextIcon: ReactNode
  navPrevDoubleIcon: ReactNode
  navPrevIcon: ReactNode
  navYearFirst: boolean | undefined
  onMonthClick: () => void
  onNavigationClick: (direction: string, double?: boolean) => void
  onYearClick: () => void
  view: string
}) => {
  const {
    addMonths,
    calendarDate,
    locale,
    navigation,
    navNextDoubleIcon,
    navNextIcon,
    navPrevDoubleIcon,
    navPrevIcon,
    navYearFirst,
    onMonthClick,
    onNavigationClick,
    onYearClick,
    view,
  } = props

  const [date, setDate] = useState<Date | null>()
  useEffect(() => {
    if (addMonths !== 0) {
      setDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + addMonths, 1))
      return
    }

    setDate(calendarDate)
  }, [calendarDate])

  return (
    <div className="calendar-nav">
      {navigation && (
        <div className="calendar-nav-prev">
          <CButton color="transparent" size="sm" onClick={() => onNavigationClick('prev', true)}>
            {navPrevDoubleIcon ? (
              navPrevDoubleIcon
            ) : (
              <span className="calendar-nav-icon calendar-nav-icon-double-prev" />
            )}
          </CButton>
          {view === 'days' && (
            <CButton color="transparent" size="sm" onClick={() => onNavigationClick('prev')}>
              {navPrevIcon ? (
                navPrevIcon
              ) : (
                <span className="calendar-nav-icon calendar-nav-icon-prev" />
              )}
            </CButton>
          )}
        </div>
      )}
      <div
        className="calendar-nav-date"
        {...(navYearFirst && { style: { display: 'flex', justifyContent: 'center' } })}
      >
        {view === 'days' && (
          <CButton color="transparent" size="sm" onClick={() => navigation && onMonthClick()}>
            {date && date.toLocaleDateString(locale, { month: 'long' })}
          </CButton>
        )}
        <CButton
          color="transparent"
          size="sm"
          onClick={() => navigation && onYearClick()}
          {...(navYearFirst && { style: { order: '-1' } })}
        >
          {date && date.toLocaleDateString(locale, { year: 'numeric' })}
        </CButton>
      </div>
      {navigation && (
        <div className="calendar-nav-next">
          {view === 'days' && (
            <CButton color="transparent" size="sm" onClick={() => onNavigationClick('next')}>
              {navNextIcon ? (
                navNextIcon
              ) : (
                <span className="calendar-nav-icon calendar-nav-icon-next" />
              )}
            </CButton>
          )}
          <CButton color="transparent" size="sm" onClick={() => onNavigationClick('next', true)}>
            {navNextDoubleIcon ? (
              navNextDoubleIcon
            ) : (
              <span className="calendar-nav-icon calendar-nav-icon-double-next" />
            )}
          </CButton>
        </div>
      )}
    </div>
  )
}

export const CCalendar = forwardRef<HTMLDivElement, CCalendarProps>(
  (
    {
      startDate,
      endDate,
      calendarDate = startDate || endDate || null,
      calendars = 1,
      className,
      dayFormat = 'numeric',
      disabledDates,
      firstDayOfWeek = 1,
      locale = 'default',
      maxDate,
      minDate,
      navigation = true,
      navNextIcon,
      navNextDoubleIcon,
      navPrevIcon,
      navPrevDoubleIcon,
      navYearFirst,
      range,
      selectEndDate,
      weekdayFormat = 2,
      onCalendarCellHover,
      onCalendarDateChange,
      onEndDateChange,
      onStartDateChange,
      onSelectEndChange,
      onViewChanged,
    },
    ref,
  ) => {
    const isInitialMount = useRef(true)
    const [_calendarDate, setCalendarDate] = useState<Date | null>(null)

    useEffect(() => {
      if (calendarDate === null) {
        setCalendarDate(new Date())
        return
      }

      if (calendarDate) {
        const date = new Date(calendarDate)
        !isSameDateAs(_calendarDate, date) && setCalendarDate(date)
      }
    }, [calendarDate])

    const [_startDate, setStartDate] = useStateWithCallback<Date | null>(
      startDate ? new Date(startDate) : null,
      onStartDateChange,
      !isInitialMount.current,
    )
    useEffect(() => {
      const date = startDate ? new Date(startDate) : null
      if (!isSameDateAs(date, _startDate)) {
        setStartDate(date)
      }
    }, [startDate])

    const [_endDate, setEndDate] = useStateWithCallback<Date | null>(
      endDate ? new Date(endDate) : null,
      onEndDateChange,
      !isInitialMount.current,
    )
    useEffect(() => {
      const date = endDate ? new Date(endDate) : null
      if (!isSameDateAs(date, _endDate)) {
        setEndDate(date)
      }
    }, [endDate])

    const [_hoverDate, setHoverDate] = useState<Date | null>(null)

    const [_maxDate, setMaxDate] = useState<Date | null>(maxDate ? new Date(maxDate) : null)
    useEffect(() => {
      maxDate && setMaxDate(new Date(maxDate))
    }, [maxDate])

    const [_minDate, setMinDate] = useState<Date | null>(minDate ? new Date(minDate) : null)
    useEffect(() => {
      minDate && setMinDate(new Date(minDate))
    }, [minDate])

    const [_selectEndDate, setSelectEndDate] = useStateWithCallback(
      selectEndDate,
      onSelectEndChange,
    )
    useEffect(() => {
      setSelectEndDate(selectEndDate)
    }, [selectEndDate])

    useEffect(() => {
      !isInitialMount.current &&
        typeof _selectEndDate === 'boolean' &&
        onSelectEndChange &&
        onSelectEndChange(_selectEndDate)
    }, [_selectEndDate])

    const [view, setView] = useStateWithCallback('days', onViewChanged)

    useEffect(() => {
      isInitialMount.current = false
    }, [])

    const setCalendarPage = (years: number, months = 0, setMonth?: number) => {
      if (_calendarDate === null) {
        return
      }

      const year = _calendarDate.getFullYear()
      const month = _calendarDate.getMonth()
      const d = new Date(year, month, 1)

      years && d.setFullYear(d.getFullYear() + years)
      months && d.setMonth(d.getMonth() + months)
      typeof setMonth === 'number' && d.setMonth(setMonth)

      setCalendarDate(d)
      onCalendarDateChange && onCalendarDateChange(d)
    }

    const handleCellOnClick = (date: Date) => {
      if (isDateDisabled(date, _minDate, _maxDate, disabledDates)) {
        return
      }

      if (range) {
        if (_selectEndDate) {
          setSelectEndDate(false)

          if (_startDate && _startDate > date) {
            setStartDate(null)
            setEndDate(null)
            return
          }

          if (isDisableDateInRange(_startDate, date, disabledDates)) {
            setStartDate(null)
            setEndDate(null)
            return
          }

          setEndDate(date)
          return
        }

        if (_endDate && _endDate < date) {
          setStartDate(null)
          setEndDate(null)
          return
        }

        if (isDisableDateInRange(date, _endDate, disabledDates)) {
          setStartDate(null)
          setEndDate(null)
          return
        }

        setSelectEndDate(true)
        setStartDate(date)
        return
      }

      setStartDate(date)
    }

    const handleCellMouseEnter = (date: Date) => {
      if (isDateDisabled(date, _minDate, _maxDate, disabledDates)) {
        return
      }
      setHoverDate(date)
      onCalendarCellHover && onCalendarCellHover(date)
    }

    const handleCellMouseLeave = () => {
      setHoverDate(null)
      onCalendarCellHover && onCalendarCellHover(null)
    }

    const handleCellKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, date: Date) => {
      if (event.code === 'Space' || event.key === 'Enter') {
        event.preventDefault()
        handleCellOnClick && handleCellOnClick(date)
        return
      }
    }

    const handleNavigationOnClick = (direction: string, double = false) => {
      if (direction === 'prev') {
        if (double) {
          setCalendarPage(view === 'years' ? -10 : -1)
          return
        }

        if (view !== 'days') {
          setCalendarPage(-1)
          return
        }

        setCalendarPage(0, -1)
        return
      }
      if (direction === 'next') {
        if (double) {
          setCalendarPage(view === 'years' ? 10 : 1)
          return
        }

        if (view !== 'days') {
          setCalendarPage(1)
          return
        }

        setCalendarPage(0, 1)
        return
      }
    }

    return (
      <div className={classNames('calendars', className)}>
        {_calendarDate &&
          Array.from({ length: calendars }, (_, index) => (
            <div className={classNames('calendar', view)} key={index} ref={ref}>
              <Navigation
                addMonths={index}
                calendarDate={_calendarDate}
                locale={locale}
                navigation={navigation}
                navNextDoubleIcon={navNextDoubleIcon}
                navNextIcon={navNextIcon}
                navPrevDoubleIcon={navPrevDoubleIcon}
                navPrevIcon={navPrevIcon}
                navYearFirst={navYearFirst}
                onMonthClick={() => setView('months')}
                onNavigationClick={handleNavigationOnClick}
                onYearClick={() => setView('years')}
                view={view}
              />
              <Calendar
                addMonths={index}
                calendarDate={_calendarDate}
                dayFormat={dayFormat}
                disabledDates={disabledDates}
                endDate={_endDate}
                firstDayOfWeek={firstDayOfWeek}
                hoverDate={_hoverDate}
                locale={locale}
                maxDate={_maxDate}
                minDate={_minDate}
                onCellClick={handleCellOnClick}
                onCellKeyDown={handleCellKeyDown}
                onCellMouseEnter={handleCellMouseEnter}
                onCellMouseLeave={handleCellMouseLeave}
                onMonthClick={(month, view) => {
                  setCalendarPage(0, 0, month)
                  setView(view)
                }}
                onYearClick={(date, view) => {
                  setCalendarDate(date)
                  setView(view)
                }}
                selectEndDate={_selectEndDate}
                startDate={_startDate}
                view={view}
                weekdayFormat={weekdayFormat}
              />
            </div>
          ))}
      </div>
    )
  },
)

CCalendar.propTypes = {
  className: PropTypes.string,
  calendarDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  calendars: PropTypes.number,
  dayFormat: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.oneOf<'2-digit' | 'numeric'>(['2-digit', 'numeric']),
  ]),
  disabledDates: PropTypes.array,
  endDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  firstDayOfWeek: PropTypes.number,
  locale: PropTypes.string,
  maxDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  minDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  navigation: PropTypes.bool,
  navNextIcon: PropTypes.node,
  navNextDoubleIcon: PropTypes.node,
  navPrevIcon: PropTypes.node,
  navPrevDoubleIcon: PropTypes.node,
  navYearFirst: PropTypes.bool,
  range: PropTypes.bool,
  selectEndDate: PropTypes.bool,
  startDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  weekdayFormat: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.oneOf<'long' | 'narrow' | 'short'>(['long', 'narrow', 'short']),
  ]),
  onCalendarCellHover: PropTypes.func,
  onCalendarDateChange: PropTypes.func,
  onEndDateChange: PropTypes.func,
  onSelectEndChange: PropTypes.func,
  onStartDateChange: PropTypes.func,
  onViewChanged: PropTypes.func,
}

CCalendar.displayName = 'CCalendar'
