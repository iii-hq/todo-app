import { Button, Card, Checkbox, Chip, Input, Label } from '@heroui/react'
import type React from 'react'
import { useState } from 'react'
import { useTodos } from './hooks/use-todos'

export default function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompleted, remaining, completedCount } = useTodos()
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const title = input.trim()
    if (!title) return
    addTodo(title)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-xl flex-col px-4 py-12">
      <Card variant="transparent">
        <Card.Header className="flex-row items-center justify-between">
          <div>
            <Card.Title className="text-2xl font-bold tracking-tight">Todo App</Card.Title>
            <Card.Description>Keep track of your tasks</Card.Description>
          </div>
          {todos.length > 0 && (
            <div className="flex gap-2">
              <Chip color="accent" variant="soft" size="sm">
                {remaining} pending
              </Chip>
              {completedCount > 0 && (
                <Chip color="success" variant="soft" size="sm">
                  {completedCount} done
                </Chip>
              )}
            </div>
          )}
        </Card.Header>

        <Card.Content className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              aria-label="New todo"
              className="flex-1"
              placeholder="What needs to be done?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button onPress={handleAdd} isDisabled={!input.trim()}>
              Add
            </Button>
          </div>

          {todos.length === 0 ? (
            <Card variant="transparent" className="py-8">
              <Card.Content className="text-center">
                <p className="text-sm text-foreground-secondary">No todos yet — add one above to get started.</p>
              </Card.Content>
            </Card>
          ) : (
            <ul className="flex flex-col gap-2">
              {todos.map((todo) => (
                <li key={todo.id}>
                  <Card variant="default" className="flex-row items-center gap-3 px-4 py-3">
                    <Checkbox variant="secondary" isSelected={todo.completed} onChange={() => toggleTodo(todo.id)}>
                      <Checkbox.Control className="size-6 rounded-full before:rounded-full [&_[data-slot='checkbox-default-indicator--checkmark']]:size-4">
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <Checkbox.Content>
                        <Label
                          className={
                            todo.completed ? 'line-through opacity-50 transition-opacity' : 'transition-opacity'
                          }
                        >
                          {todo.title}
                        </Label>
                      </Checkbox.Content>
                    </Checkbox>

                    <Button
                      variant="ghost"
                      size="sm"
                      isIconOnly
                      aria-label={`Delete ${todo.title}`}
                      onPress={() => deleteTodo(todo.id)}
                      className="ml-auto cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <title>Remove</title>
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </Button>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </Card.Content>

        {todos.length > 0 && (
          <Card.Footer className="justify-between">
            <p className="text-sm text-foreground-secondary">
              {remaining} {remaining === 1 ? 'item' : 'items'} remaining
            </p>
            {completedCount > 0 && (
              <Button variant="ghost" size="sm" onPress={clearCompleted} className="cursor-pointer">
                Clear completed
              </Button>
            )}
          </Card.Footer>
        )}
      </Card>
    </div>
  )
}
