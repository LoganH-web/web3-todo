import React, { useState } from 'react';
import { TodoItem } from './TodoItem';
import { isMyTask } from '../utils/formatters';

/**
 * TodoList Component
 * Displays list of todos with filtering option
 */
export function TodoList({ 
  todos, 
  loading, 
  account, 
  onToggle, 
  onDelete, 
  togglingId, 
  deletingId,
  disabled 
}) {
  const [showOnlyMyTasks, setShowOnlyMyTasks] = useState(false);

  const filteredTodos = todos.filter(todo => 
    !showOnlyMyTasks || isMyTask(todo.owner, account)
  );

  return (
    <section className="todo-list">
      <div className="todo-list-header">
        <h2>Your Todos</h2>
        {account && todos.length > 0 && (
          <label className="filter-toggle">
            <input
              type="checkbox"
              checked={showOnlyMyTasks}
              onChange={(e) => setShowOnlyMyTasks(e.target.checked)}
            />
            <span>Show only my tasks</span>
          </label>
        )}
      </div>
      
      {loading ? (
        <div className="loading">
          <div className="spinner" /> Loading todos...
        </div>
      ) : todos.length === 0 ? (
        <div className="empty">
          {account ? 'No todos yet — create one to get started.' : 'No todos yet — connect wallet to interact.'}
        </div>
      ) : filteredTodos.length === 0 ? (
        <div className="empty">
          No tasks found. Try unchecking "Show only my tasks".
        </div>
      ) : (
        <ul className="todos">
          {filteredTodos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              index={index}
              account={account}
              onToggle={onToggle}
              onDelete={onDelete}
              togglingId={togglingId}
              deletingId={deletingId}
              disabled={disabled}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

