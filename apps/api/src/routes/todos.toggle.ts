import { logger } from '../iii.ts'
import { fn } from '../lib/decorators.ts'
import { type Todo, todosStream } from './todos.stream.ts'

export const toggleTodo = fn(
  'todos::toggle',
  async (req: { id: string }): Promise<Todo | null> => {
    logger.info('Toggling todo', { id: req.id })

    const item = await todosStream.get({ group_id: 'todos', item_id: req.id })
    if (!item) {
      console.log('Todo not found', { id: req.id })
      return null
    }

    const result = await todosStream.update({
      group_id: 'todos',
      item_id: req.id,
      ops: [{ type: 'set', path: 'completed', value: !item.completed }],
    })

    return result?.new_value ?? null
  },
  { description: 'Toggle a todo completed status' },
)
