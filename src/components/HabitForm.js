import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const HabitForm = ({ addHabit, updateHabit, selectedHabit, isEditing, cancelEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  // Update form data when editing an existing habit
  useEffect(() => {
    if (selectedHabit && isEditing) {
      setFormData({
        name: selectedHabit.name || '',
        description: selectedHabit.description || ''
      });
    } else {
      setFormData({
        name: '',
        description: ''
      });
    }
  }, [selectedHabit, isEditing]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Si us plau, introdueix un nom per a l\'hàbit');
      return;
    }
    
    if (isEditing && selectedHabit) {
      // Update existing habit
      updateHabit({
        ...selectedHabit,
        name: formData.name,
        description: formData.description
      });
    } else {
      // Add new habit
      const newHabit = {
        id: uuidv4(),
        name: formData.name,
        description: formData.description,
        completedDays: [],
        createdAt: new Date().toISOString()
      };
      addHabit(newHabit);
      
      // Reset form
      setFormData({
        name: '',
        description: ''
      });
    }
  };
  
  return (
    <div className="card habit-form">
      <h2 className="habit-form-title">
        {isEditing ? 'Editar Hàbit' : 'Afegir Nou Hàbit'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nom de l'Hàbit:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ex: Llegir 30 minuts"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Descripció (opcional):</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Descriu l'hàbit amb més detall..."
            rows="3"
          />
        </div>
        
        <div className="form-actions">
          {isEditing && (
            <button 
              type="button" 
              className="btn" 
              onClick={cancelEdit}
            >
              Cancel·lar
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Actualitzar Hàbit' : 'Afegir Hàbit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HabitForm;
