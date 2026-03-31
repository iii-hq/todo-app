import type { RemoteFunctionHandler, Trigger } from 'iii-sdk'
import { iii } from '../iii.ts'

export interface FnOptions {
  description?: string
  metadata?: Record<string, unknown>
}

export interface FnRegistration {
  http(method: string, path: string): FnRegistration
  unregister(): void
}

export function fn(id: string, handler: RemoteFunctionHandler, options?: FnOptions): FnRegistration {
  const ref = iii.registerFunction({ id, description: options?.description ?? '' }, handler)
  const triggers: Trigger[] = []

  const registration: FnRegistration = {
    http(method, path) {
      triggers.push(
        iii.registerTrigger({
          type: 'http',
          function_id: ref.id,
          config: { api_path: path, http_method: method },
        }),
      )
      return registration
    },
    unregister() {
      for (const t of triggers) t.unregister()
      ref.unregister()
    },
  }

  return registration
}
