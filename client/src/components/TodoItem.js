import React from 'react';
import { formatDueDate, formatAddress, isMyTask } from '../utils/formatters';

/**
 * TodoItem Component
 * Displays a single todo item with actions
 */
export function TodoItem({ 
  todo, 
  index, 
  account, 
  onToggle, 
  onDelete, 
  togglingId, 
  deletingId,
  disabled 
}) {
  const dueDateInfo = formatDueDate(todo.dueDate);
  const isOwner = isMyTask(todo.owner, account);

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-header">
        <strong>{todo.title}</strong>
        <span className="todo-id">#{index + 1}</span>
      </div>
      
      <p className="todo-description">{todo.description}</p>
      
      {todo.owner && (
        <div className="todo-owner">
          <span className="owner-label">Owner:</span>
          <span className={`owner-address ${isOwner ? 'my-task' : ''}`}>
            {isOwner ? '👤 You' : formatAddress(todo.owner)}
          </span>
        </div>
      )}
      
      {dueDateInfo && (
        <div className={`due-date due-${dueDateInfo.status}`}>
          📅 {dueDateInfo.text} <span className="due-badge">{dueDateInfo.badge}</span>
        </div>
      )}
      
      <div className="todo-status">
        <span className={`status ${todo.completed ? 'completed' : 'pending'}`}>
          {todo.completed ? '✓ Completed' : 'Pending'}
        </span>
        <div className="todo-actions">
          <button
            className="toggle"
            onClick={() => onToggle(todo.id)}
            disabled={disabled || !!togglingId || !!deletingId}
          >
            {togglingId === todo.id ? 'Processing...' : todo.completed ? 'Mark Pending' : 'Mark Done'}
          </button>
          <button
            className="delete"
            onClick={() => onDelete(todo.id)}
            disabled={disabled || !!togglingId || !!deletingId}
          >
            {deletingId === todo.id ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </li>
  );
}

