import { endOfDecade, endOfMonth, endOfQuarter, endOfYear, startOfDecade, startOfMonth, startOfQuarter, startOfYear } from 'date-fns'
import { tempo, tempo_by } from "./tempo"

export const secondly = tempo('1秒', '0')
export const minutely = tempo('1分', '0')
export const hourly = tempo('1時間', '0')
export const daily = tempo('1日', '0')
export const weekly = tempo('1週', '0')

export const monthly = tempo_by([
  (now)=> startOfMonth(now).getTime(),
  (now)=> endOfMonth(now).getTime() + 1
],'0')

export const quarterly = tempo_by([
  (now)=> startOfQuarter(now).getTime(),
  (now)=> endOfQuarter(now).getTime() + 1
],'0')

export const yearly = tempo_by([
  (now)=> startOfYear(now).getTime(),
  (now)=> endOfYear(now).getTime() + 1
],'0')

export const decadely = tempo_by([
  (now)=> startOfDecade(now).getTime(),
  (now)=> endOfDecade(now).getTime() + 1
],'0')
