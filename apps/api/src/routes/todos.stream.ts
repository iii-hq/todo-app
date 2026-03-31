import type {
  DeleteResult,
  IStream,
  StreamDeleteInput,
  StreamGetInput,
  StreamListGroupsInput,
  StreamListInput,
  StreamSetInput,
  StreamSetResult,
  StreamUpdateInput,
  StreamUpdateResult,
} from 'iii-sdk/stream'
import { iii } from '../iii.ts'

export interface Todo {
  id: string
  title: string
  completed: boolean
}

const mutateArgs = (args: any) => ({ ...args, stream_name: 'todo' })

export class TodoStream implements IStream<Todo> {
  async get(args: Omit<StreamGetInput, 'stream_name'>): Promise<Todo | null> {
    return iii.trigger({ function_id: 'stream::get', payload: mutateArgs(args) })
  }

  async set(args: Omit<StreamSetInput, 'stream_name'>): Promise<StreamSetResult<Todo>> {
    return iii.trigger({ function_id: 'stream::set', payload: mutateArgs(args) })
  }

  async list(args: Omit<StreamListInput, 'stream_name'>): Promise<Todo[]> {
    return iii.trigger({ function_id: 'stream::list', payload: mutateArgs(args) })
  }

  async update(args: Omit<StreamUpdateInput, 'stream_name'>): Promise<StreamUpdateResult<Todo> | null> {
    return iii.trigger({ function_id: 'stream::update', payload: mutateArgs(args) })
  }

  async listGroups(args: Omit<StreamListGroupsInput, 'stream_name'>): Promise<string[]> {
    return iii.trigger({ function_id: 'stream::listGroups', payload: mutateArgs(args) })
  }

  async delete(args: Omit<StreamDeleteInput, 'stream_name'>): Promise<DeleteResult> {
    return iii.trigger({ function_id: 'stream::delete', payload: mutateArgs(args) })
  }
}

export const todosStream = new TodoStream()
