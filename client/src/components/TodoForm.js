import React, { useState } from 'react';

/**
 * TodoForm Component
 * Form for creating new todo items
 */
export function TodoForm({ onSubmit, account, disabled }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async () => {
    const result = await onSubmit(title, description, dueDate);
    if (result?.success) {
      // Clear form on success
      setTitle('');
      setDescription('');
      setDueDate('');
    }
  };

  return (
    <section className="todo-form">
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={!account || disabled}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={!account || disabled}
      />
      <div className="date-input-wrapper">
        <label htmlFor="dueDate">Due Date (optional):</label>
        <input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={!account || disabled}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={!account || disabled || !title.trim()}
      >
        {disabled ? 'Adding...' : 'Add Todo'}
      </button>
    </section>
  );
}

