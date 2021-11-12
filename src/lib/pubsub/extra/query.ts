import { socket } from '$lib/db/socket.io-client'
import { randoms, new_plans } from '../model-client'
import '../client'

export const random_test = socket(randoms).query(['trump', 'zodiac', 'IAU'])
export const new_plan = socket(new_plans).query()
