import { registerWorker } from 'iii-sdk'

export const iii = registerWorker(process.env.III_URL ?? 'ws://localhost:49134', {
  workerName: 'api-worker',
})
