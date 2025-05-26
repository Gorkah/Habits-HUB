import React from 'react';
import { format, addDays, subDays, isAfter, isBefore, isEqual, parseISO } from 'date-fns';

const HabitList = ({ habits, toggleHabitCompletion, deleteHabit, editHabit }) => {
  // Get today's date as a string in format YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate the current streak for a habit
  const calculateStreak = (habit) => {
    if (!habit.completedDays || habit.completedDays.length === 0) {
      return 0;
    }
    
    // Sort completed days in descending order (newest first)
    const sortedDays = [...habit.completedDays].sort((a, b) => b.localeCompare(a));
    
    // Check if today is completed
    const isTodayCompleted = sortedDays.includes(today);
    
    let currentDate = isTodayCompleted ? today : sortedDays[0];
    let streak = isTodayCompleted ? 1 : 0;
    
    // Start checking from yesterday or the most recent day
    let dateToCheck = parseISO(currentDate);
    
    while (true) {
      dateToCheck = subDays(dateToCheck, 1);
      const dateString = dateToCheck.toISOString().split('T')[0];
      
      if (habit.completedDays.includes(dateString)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  // Format streak text based on the number
  const getStreakText = (streak) => {
    if (streak === 0) return 'Sense racha';
    if (streak === 1) return '1 dia';
    return `${streak} dies`;
  };
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
        sortedHabits.map((habit) => {
          const streak = calculateStreak(habit);
          const totalCompletions = habit.completedDays ? habit.completedDays.length : 0;
          const createdAt = habit.createdAt ? new Date(habit.createdAt).toLocaleDateString('ca') : '-';
          
          return (
            <div 
              key={habit.id} 
              className={`habit-item ${isCompletedToday(habit) ? 'completed' : ''}`}
            >
              <div className="habit-info">
                <h3 className="habit-name">{habit.name}</h3>
                {habit.description && (
                  <p className="habit-description">{habit.description}</p>
                )}
                <div className="habit-meta">
                  <span className="meta-item">
                    <span className="meta-icon">🗓️</span>
                    Creat: {createdAt}
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">✅</span>
                    Total: {totalCompletions} {totalCompletions === 1 ? 'dia' : 'dies'}
                  </span>
                </div>
              </div>
              
              <div className="habit-actions">
                {streak > 0 && (
                  <div className="habit-streak">
                    <span className="streak-icon">🔥</span>
                    {getStreakText(streak)}
                  </div>
                )}
                
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
          );
        })
      )}
    </div>
  );
};

export default HabitList;
