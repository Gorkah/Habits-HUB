import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './App.css';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';
import HabitCalendar from './components/HabitCalendar';
import Header from './components/Header';

function App() {
  // State for habits
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(false);
  
  // Load habits from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  // Save habits to localStorage whenever the habits state changes
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  // Add a new habit
  const addHabit = (habit) => {
    const newHabits = [...habits, habit];
    setHabits(newHabits);
    toast.success('Hàbit creat correctament!');
  };

  // Update an existing habit
  const updateHabit = (updatedHabit) => {
    const newHabits = habits.map((habit) => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    );
    setHabits(newHabits);
    setSelectedHabit(null);
    setIsEditing(false);
    toast.success('Hàbit actualitzat correctament!');
  };

  // Delete a habit
  const deleteHabit = (id) => {
    if (window.confirm('Estàs segur que vols eliminar aquest hàbit?')) {
      const newHabits = habits.filter((habit) => habit.id !== id);
      setHabits(newHabits);
      toast.success('Hàbit eliminat correctament!');
    }
  };

  // Mark a habit as completed for today
  const toggleHabitCompletion = (id, date = new Date().toISOString().split('T')[0]) => {
    const newHabits = habits.map((habit) => {
      if (habit.id === id) {
        const completedDays = habit.completedDays || [];
        const dayIndex = completedDays.indexOf(date);
        
        if (dayIndex !== -1) {
          // Remove the date if already completed (undo)
          const newCompletedDays = [...completedDays];
          newCompletedDays.splice(dayIndex, 1);
          toast.info('Marcatge d\'hàbit desfet!');
          return { ...habit, completedDays: newCompletedDays };
        } else {
          // Add the date to completed days
          toast.success('Hàbit completat!');
          return { ...habit, completedDays: [...completedDays, date] };
        }
      }
      return habit;
    });
    
    setHabits(newHabits);
  };

  // Edit a habit
  const editHabit = (habit) => {
    setSelectedHabit(habit);
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setSelectedHabit(null);
    setIsEditing(false);
  };

  // Toggle between list and calendar view
  const toggleView = () => {
    setShowCalendarView(!showCalendarView);
  };

  return (
    <div className="app">
      <Header />
      <div className="container">
        <div className="view-toggle">
          <button 
            className={`btn ${!showCalendarView ? 'btn-primary' : ''}`} 
            onClick={() => setShowCalendarView(false)}
          >
            Llista d'Hàbits
          </button>
          <button 
            className={`btn ${showCalendarView ? 'btn-primary' : ''}`} 
            onClick={() => setShowCalendarView(true)}
          >
            Calendari de Progrés
          </button>
        </div>
        
        {!showCalendarView ? (
          <>
            <HabitForm 
              addHabit={addHabit} 
              updateHabit={updateHabit} 
              selectedHabit={selectedHabit}
              isEditing={isEditing}
              cancelEdit={cancelEdit}
            />
            <HabitList 
              habits={habits} 
              toggleHabitCompletion={toggleHabitCompletion} 
              deleteHabit={deleteHabit}
              editHabit={editHabit}
            />
          </>
        ) : (
          <HabitCalendar habits={habits} />
        )}
      </div>
    </div>
  );
}

export default App;
