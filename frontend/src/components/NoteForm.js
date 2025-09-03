import React from 'react';

const NoteForm = ({ form, setForm, handleSubmit, isEditing }) => {
  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      />
      <button type="submit">
        {isEditing ? 'Update Note' : 'Add Note'}
      </button>
    </form>
  );
};

export default NoteForm;
