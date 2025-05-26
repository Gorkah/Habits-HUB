import React, { useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { addDays, subDays, format, startOfYear, endOfYear } from 'date-fns';
import { ca } from 'date-fns/locale';

const HabitCalendar = ({ habits }) => {
  const [selectedHabit, setSelectedHabit] = useState(habits.length > 0 ? habits[0].id : null);
  
  // If no habits, show a message
  if (habits.length === 0) {
    return (
      <div className="calendar-container">
        <div className="card">
          <h2 className="calendar-header">Calendari de Progrés</h2>
          <p className="no-habits-message">No hi ha hàbits per mostrar. Afegeix-ne alguns per veure el teu progrés!</p>
        </div>
      </div>
    );
  }

  // Get data for the selected habit
  const currentHabit = habits.find(h => h.id === selectedHabit) || habits[0];
  
  // Date range for the calendar (current year)
  const startDate = startOfYear(new Date());
  const endDate = endOfYear(new Date());
  
  // Prepare data for the heatmap
  const getHeatmapData = () => {
    const completedDays = currentHabit.completedDays || [];
    
    return completedDays.map(day => ({
      date: day,
      count: 1
    }));
  };
  
  // Get color based on value
  const getColor = (value) => {
    if (!value) return 'color-scale-1';
    return 'color-scale-4';
  };
  
  // Format date for tooltip
  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'dd MMMM yyyy', { locale: ca });
  };

  return (
    <div className="calendar-container">
      <div className="card">
        <h2 className="calendar-header">Calendari de Progrés</h2>
        
        <div className="form-group">
          <label htmlFor="habit-selector">Selecciona un hàbit:</label>
          <select 
            id="habit-selector" 
            value={selectedHabit} 
            onChange={(e) => setSelectedHabit(e.target.value)}
          >
            {habits.map(habit => (
              <option key={habit.id} value={habit.id}>
                {habit.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="habit-calendar">
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={getHeatmapData()}
            classForValue={(value) => getColor(value)}
            tooltipDataAttrs={(value) => {
              if (!value || !value.date) {
                return null;
              }
              return {
                'data-tooltip-id': 'calendar-tooltip',
                'data-tooltip-content': `${formatDate(value.date)}: Completat`
              };
            }}
            showWeekdayLabels={true}
            gutterSize={2}
          />
          <ReactTooltip id="calendar-tooltip" />
          
          <div className="color-scale-legend">
            <div className="legend-item">
              <div className="color-box color-scale-1"></div>
              <span className="legend-label">No completat</span>
            </div>
            <div className="legend-item">
              <div className="color-box color-scale-4"></div>
              <span className="legend-label">Completat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCalendar;
