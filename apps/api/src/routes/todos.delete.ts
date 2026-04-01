import { logger } from '../iii.ts'
import { fn } from '../lib/decorators.ts'
import { todosStream } from './todos.stream.ts'

export const deleteTodo = fn(
  'todos::delete',
  async (req: { id: string }): Promise<{ id: string; deleted: boolean }> => {
    logger.info('Deleting todo', { id: req.id })
    const result = await todosStream.delete({ group_id: 'todos', item_id: req.id })
    return { id: req.id, deleted: result.old_value !== null }
  },
  { description: 'Delete a TODO by ID' },
)
