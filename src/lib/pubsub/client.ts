import { dev } from '$app/env'
import client, { socket } from '$lib/db/socket.io-client'
import { randoms, events, new_plans, story_summary } from './model-client'
import * as stores from './model-client'

if (dev) {
  client('http://localhost:3001', stores)
} else {
  client('https://localhost:3001', stores)
}

export const StorySummary = socket(story_summary)

export const Events = socket(events)

export const NewPlans = socket(new_plans)

export const Randoms = socket(randoms)
