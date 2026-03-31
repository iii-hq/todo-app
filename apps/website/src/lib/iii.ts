import { registerWorker } from 'iii-browser-sdk'

export const iii = registerWorker('ws://localhost:3111', {
  workerName: 'browser-client',
})
