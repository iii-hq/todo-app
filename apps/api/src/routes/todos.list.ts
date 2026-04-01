import { logger } from '../iii.ts'
import { fn } from '../lib/decorators.ts'
import { type Todo, todosStream } from './todos.stream.ts'

export const listTodos = fn(
  'todos::list',
  async (): Promise<{ items: Todo[] }> => {
    logger.info('Listing todos')
    const items = await todosStream.list({ group_id: 'todos' })
    return { items }
  },
  { description: 'List all todos' },
)
