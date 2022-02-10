import { __BROWSER__ } from 'svelte-petit-utils'

export const SECOND = 1000
export const MINUTE = 60000
export const HOUR = 3600000
export const DAY = 86400000
export const WEEK = 604800000
export const MONTH = 2629728000 // 今世紀平均
export const YEAR = 31556736000 // 今世紀平均

const timezone = __BROWSER__ ? MINUTE * new Date().getTimezoneOffset() : to_msec('-9h')
export const tempo_zero = -new Date(0).getDay() * DAY + timezone

export function to_msec(timer: string): number {
  let timeout = 0
  timer?.replace(
    /(\d+)([ヵ]?([smhdwy秒分時日週月年])[間]?(半$)?)|0/g,
    (full, num_str: string, fullunit, unit: string, appendix: string) => {
      let num = Number(num_str)
      if (!num) return ''
      if ('半' === appendix) num += 0.5

      let unit_size = 0
      switch (unit) {
        case 's':
        case '秒':
          unit_size = SECOND
          break

        case 'm':
        case '分':
          unit_size = MINUTE
          break

        case 'h':
        case '時':
          unit_size = HOUR
          break

        case 'd':
        case '日':
          unit_size = DAY
          break

        case 'w':
        case '週':
          unit_size = WEEK
          break

        case '月':
          unit_size = MONTH
          break

        case 'y':
        case '年':
          unit_size = YEAR
          break
        // 2019 average.

        default:
          throw new Error(`${timer} at ${num}${unit}`)
      }
      timeout += num * unit_size
      return ''
    }
  )
  return timeout
}
