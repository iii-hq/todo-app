import { logger } from '../iii.ts'
import { fn } from '../lib/decorators.ts'
import { type Todo, todosStream } from './todos.stream.ts'

export const listTodos = fn(
  'todos::list',
  async (): Promise<{ items: Todo[] }> => {
    const items = await todosStream.list({ group_id: 'todos' })
    return { items }
  },
  { description: 'List all todos' },
)

export const getTodo = fn(
  'todos::get',
  async (req: { id: string }): Promise<Todo | null> => {
    const item = await todosStream.get({ group_id: 'todos', item_id: req.id })
    return item ?? null
  },
  { description: 'Get a single todo by ID' },
)

export const deleteTodo = fn(
  'todos::delete',
  async (req: { id: string }): Promise<{ id: string; deleted: boolean }> => {
    logger.info('Deleting todo', { id: req.id })
    console.log('Deleting todo', { id: req.id })
    const result = await todosStream.delete({ group_id: 'todos', item_id: req.id })
    console.log('Deleted todo', { id: req.id, result })
    return { id: req.id, deleted: result.old_value !== null }
  },
  { description: 'Delete a todo by ID' },
)
