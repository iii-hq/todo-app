import { logger } from '../iii.ts'
import { fn } from '../lib/decorators.ts'
import { type Todo, todosStream } from './todos.stream.ts'

export const createTodo = fn(
  'todos::create',
  async (req: { title: string }): Promise<Todo> => {
    logger.info('Creating todo', { title: req.title })

    const id = crypto.randomUUID()
    const result = await todosStream.set({
      group_id: 'todos',
      item_id: id,
      data: { id, title: req.title, completed: false },
    })

    return result.new_value
  },
  { description: 'Create a new todo' },
)
