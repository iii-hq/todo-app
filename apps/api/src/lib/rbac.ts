import type { AuthInput, AuthResult } from 'iii-sdk'
import { logger } from '../iii.ts'
import { fn } from './decorators.ts'

fn('todo-project::auth-function', async (input: AuthInput): Promise<AuthResult> => {
  const sessionId = crypto.randomUUID()
  logger.info('New session created', { sessionId, ip: input.ip_address })

  return {
    allowed_functions: [],
    forbidden_functions: [],
    allow_trigger_type_registration: false,
    allow_function_registration: true,
    allowed_trigger_types: ['stream'],
    context: { session_id: sessionId },
    function_registration_prefix: sessionId,
  }
})
