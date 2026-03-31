import type { StreamChangeEvent } from 'iii-browser-sdk/stream'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { iii } from '../lib/iii'

export interface Todo {
  id: string
  title: string
  completed: boolean
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    void iii
      .trigger<Record<string, never>, { items: Todo[] }>({
        function_id: 'todos::list',
        payload: {},
      })
      .then(({ items }) => setTodos(items))

    const funcRef = iii.registerFunction({ id: 'ui::on-todo-change' }, async (input: StreamChangeEvent) => {
      const todo = input.event.data as Todo

      console.log('on-todo-change', input)

      switch (input.event.type) {
        case 'create':
          setTodos((prev) => [...prev, todo])
          break
        case 'update':
          console.log('update-todo', input)
          setTodos((prev) => prev.map((t) => (t.id === input.id ? todo : t)))
          break
        case 'delete':
          setTodos((prev) => prev.filter((t) => t.id !== input.id))
          break
      }

      return {}
    })

    const trigger = iii.registerTrigger({
      type: 'stream',
      function_id: funcRef.id,
      config: { stream_name: 'todo', group_id: 'todos' },
    })

    return () => {
      trigger.unregister()
      funcRef.unregister()
    }
  }, [])

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
