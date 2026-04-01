import { logger } from '../iii.ts'
import { fn } from '../lib/decorators.ts'
import { type Todo, todosStream } from './todos.stream.ts'

export const getTodo = fn(
  'todos::get',
  async (req: { id: string }): Promise<Todo | null> => {
    logger.info('Getting todo', { id: req.id })
    const item = await todosStream.get({ group_id: 'todos', item_id: req.id })
    return item ?? null
  },
  { description: 'Get a single TODO by ID' },
)
