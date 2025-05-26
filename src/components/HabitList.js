import React from 'react';

const HabitList = ({ habits, toggleHabitCompletion, deleteHabit, editHabit }) => {
  // Check if habit is completed for today
  const isCompletedToday = (habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDays && habit.completedDays.includes(today);
  };

  // Sort habits with completed ones at the bottom
  const sortedHabits = [...habits].sort((a, b) => {
    const aCompleted = isCompletedToday(a);
    const bCompleted = isCompletedToday(b);
    
    if (aCompleted && !bCompleted) return 1;
    if (!aCompleted && bCompleted) return -1;
    return 0;
  });

  return (
    <div className="habits-container">
      <h2>Els Meus Hàbits</h2>
      
      {sortedHabits.length === 0 ? (
        <p className="no-habits-message">No has afegit cap hàbit encara. Comença afegint el teu primer hàbit!</p>
      ) : (
        sortedHabits.map((habit) => (
          <div 
            key={habit.id} 
            className={`habit-item ${isCompletedToday(habit) ? 'completed' : ''}`}
          >
            <div className="habit-info">
              <h3 className="habit-name">{habit.name}</h3>
              {habit.description && (
                <p className="habit-description">{habit.description}</p>
              )}
            </div>
            
            <div className="habit-actions">
              <button 
                className={`btn action-complete ${isCompletedToday(habit) ? 'btn-success' : ''}`}
                onClick={() => toggleHabitCompletion(habit.id)}
                title={isCompletedToday(habit) ? "Desmarcar completat avui" : "Marcar com completat avui"}
              >
                {isCompletedToday(habit) ? "✓" : "⚪"}
              </button>
              
              <button 
                className="btn action-edit"
                onClick={() => editHabit(habit)}
                title="Editar hàbit"
              >
                ✏️
              </button>
              
              <button 
                className="btn action-delete"
                onClick={() => deleteHabit(habit.id)}
                title="Eliminar hàbit"
              >
                🗑️
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default HabitList;
