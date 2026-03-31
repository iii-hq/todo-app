import type { ApiRequest, ApiResponse } from 'iii-sdk'
import { fn } from '../lib/decorators.ts'
import { todosStream, type Todo } from './todos.stream.ts'

export const createTodo = fn(
  'todos::create',
  async (req: ApiRequest<{ title: string }>): Promise<ApiResponse<201, Todo>> => {
    const result = await todosStream.set({
      group_id: 'todos',
      item_id: crypto.randomUUID(),
      data: { id: crypto.randomUUID(), title: req.body.title, completed: false },
    })
    return { status_code: 201, body: result.new_value }
  },
  { description: 'Create a new todo' },
).http('POST', '/todos')
