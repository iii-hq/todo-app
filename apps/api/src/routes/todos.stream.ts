import type {
  DeleteResult,
  IStream,
  StreamDeleteInput,
  StreamGetInput,
  StreamJoinLeaveEvent,
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

export class TodoStream implements IStream<Todo> {
  private store = new Map<string, Map<string, Todo>>()

  constructor(name: string) {
    iii.createStream(name, this)
  }

  async get({ group_id, item_id }: Omit<StreamGetInput, 'stream_name'>): Promise<Todo | null> {
    return this.store.get(group_id)?.get(item_id) ?? null
  }

  async set({ group_id, item_id, data }: Omit<StreamSetInput, 'stream_name'>): Promise<StreamSetResult<Todo>> {
    if (!this.store.has(group_id)) this.store.set(group_id, new Map())
    const group = this.store.get(group_id)!
    const old = group.get(item_id)
    group.set(item_id, data)
    return { old_value: old, new_value: data }
  }

  async delete({ group_id, item_id }: Omit<StreamDeleteInput, 'stream_name'>): Promise<DeleteResult> {
    const old = this.store.get(group_id)?.get(item_id)
    this.store.get(group_id)?.delete(item_id)
    return { old_value: old }
  }

  async list({ group_id }: Omit<StreamListInput, 'stream_name'>): Promise<Todo[]> {
    const group = this.store.get(group_id)
    return group ? [...group.values()] : []
  }

  async listGroups(_input: StreamListGroupsInput): Promise<string[]> {
    return [...this.store.keys()]
  }

  async update({
    group_id,
    item_id,
    ops,
  }: Omit<StreamUpdateInput, 'stream_name'>): Promise<StreamUpdateResult<Todo> | null> {
    const group = this.store.get(group_id)
    const current = group?.get(item_id)
    if (!current) return null

    const updated = { ...current }
    for (const op of ops) {
      if (op.type === 'set') {
        ;(updated as Record<string, unknown>)[op.path] = op.value
      }
    }
    group!.set(item_id, updated)
    return { old_value: current, new_value: updated }
  }

  async onStreamJoin(event: StreamJoinLeaveEvent): Promise<void> {
    console.log(`[todos] Client joined stream: group=${event.group_id}`)
  }

  async onStreamLeave(event: StreamJoinLeaveEvent): Promise<void> {
    console.log(`[todos] Client left stream: group=${event.group_id}`)
  }
}

export const todosStream = new TodoStream('todo')
