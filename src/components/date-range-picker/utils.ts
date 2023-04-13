export const getLocalDateFromString = (string: string, locale: string, time?: boolean) => {
  if (!Number.isNaN(Date.parse(string))) {
    return new Date(Date.parse(string))
  }

  const date = new Date(2013, 11, 31, 17, 19, 22)
  let regex = time ? date.toLocaleString(locale) : date.toLocaleDateString(locale)
  regex = regex
    .replace('2013', '(?<year>[0-9]{2,4})')
    .replace('12', '(?<month>[0-9]{1,2})')
    .replace('31', '(?<day>[0-9]{1,2})')

  if (time) {
    regex = regex
      .replace('5', '(?<hour>[0-9]{1,2})')
      .replace('17', '(?<hour>[0-9]{1,2})')
      .replace('19', '(?<minute>[0-9]{1,2})')
      .replace('22', '(?<second>[0-9]{1,2})')
      .replace('PM', '(?<ampm>[A-Z]{2})')
  }

  const rgx = new RegExp(`${regex}`)
  const partials = string.match(rgx)

  if (partials === null) return

  const newDate =
    partials.groups &&
    (time
      ? new Date(
          Number(partials.groups['year']),
          Number(partials.groups['month']) - 1,
          Number(partials.groups['day']),
          partials.groups['ampm']
            ? partials.groups['ampm'] === 'PM'
              ? Number(partials.groups['hour']) + 12
              : Number(partials.groups['hour'])
            : Number(partials.groups['hour']),
          Number(partials.groups['minute']),
          Number(partials.groups['second']),
        )
      : new Date(
          Number(partials.groups['year']),
          Number(partials.groups['month']) - 1,
          Number(partials.groups['day']),
        ))

  return newDate
}
