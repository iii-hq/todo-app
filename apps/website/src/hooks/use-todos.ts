import { useStreamGroup } from '@motiadev/stream-client-react'
import { useCallback, useMemo } from 'react'
import { iii } from '../lib/iii'

export interface Todo {
  id: string
  title: string
  completed: boolean
}

export function useTodos() {
  const { data: todos } = useStreamGroup<Todo>({
    streamName: 'todo',
    groupId: 'todos',
  })

  const addTodo = useCallback(async (title: string) => {
    await iii.trigger({
      function_id: 'todos::create',
      payload: { title },
    })
  }, [])

  const toggleTodo = useCallback(async (id: string) => {
    await iii.trigger({
      function_id: 'todos::toggle',
      payload: { id },
    })
  }, [])

  const deleteTodo = useCallback(async (id: string) => {
    await iii.trigger({
      function_id: 'todos::delete',
      payload: { id },
    })
  }, [])

  const clearCompleted = useCallback(async () => {
    const completed = todos.filter((t) => t.completed)
    await Promise.all(
      completed.map(({ id }) =>
        iii.trigger({
          function_id: 'todos::delete',
          payload: { id },
        }),
      ),
    )
  }, [todos])

  const remaining = useMemo(() => todos.filter((t) => !t.completed).length, [todos])
  const completedCount = useMemo(() => todos.filter((t) => t.completed).length, [todos])

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    remaining,
    completedCount,
  }
}
