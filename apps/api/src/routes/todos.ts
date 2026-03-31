import type { ApiRequest, ApiResponse } from 'iii-sdk'
import { fn } from '../lib/decorators.ts'
import { todosStream, type Todo } from './todos.stream.ts'

export const listTodos = fn(
  'todos::list',
  async (_req: ApiRequest): Promise<ApiResponse<200, { items: Todo[] }>> => {
    const items = await todosStream.list({ group_id: 'todos' })
    return { status_code: 200, body: { items } }
  },
  { description: 'List all todos' },
).http('GET', '/todos')

export const getTodo = fn(
  'todos::get',
  async (req: ApiRequest): Promise<ApiResponse<200 | 404, Todo | null>> => {
    const item = await todosStream.get({ group_id: 'todos', item_id: req.path_params.id })
    return item ? { status_code: 200, body: item } : { status_code: 404, body: null }
  },
  { description: 'Get a single todo by ID' },
).http('GET', '/todos/:id')

export const deleteTodo = fn(
  'todos::delete',
  async (req: ApiRequest): Promise<ApiResponse<200, { id: string; deleted: boolean }>> => {
    const result = await todosStream.delete({ group_id: 'todos', item_id: req.path_params.id })
    return { status_code: 200, body: { id: req.path_params.id, deleted: result.old_value !== null } }
  },
  { description: 'Delete a todo by ID' },
).http('DELETE', '/todos/:id')
