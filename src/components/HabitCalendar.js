import React, { useState, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { addDays, subDays, format, startOfYear, endOfYear, parseISO, differenceInDays, isWithinInterval } from 'date-fns';
import { ca } from 'date-fns/locale';

const HabitCalendar = ({ habits }) => {
  const [selectedHabit, setSelectedHabit] = useState(habits.length > 0 ? habits[0].id : null);
  const [viewRange, setViewRange] = useState('year'); // 'year', 'month', 'quarter'
  const [calendarData, setCalendarData] = useState([]);
  const [streakStats, setStreakStats] = useState({ current: 0, longest: 0, totalDays: 0 });

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
  
  // Calculate date range based on view preference
  const calculateDateRange = () => {
    const today = new Date();
    
    switch(viewRange) {
      case 'month':
        return { 
          startDate: subDays(today, 30), 
          endDate: today 
        };
      case 'quarter':
        return { 
          startDate: subDays(today, 90), 
          endDate: today 
        };
      case 'year':
      default:
        return { 
          startDate: startOfYear(today), 
          endDate: today 
        };
    }
  };
  
  const { startDate, endDate } = calculateDateRange();
  
  // Calculate streak information
  const calculateStreakInfo = (habit) => {
    if (!habit || !habit.completedDays || habit.completedDays.length === 0) {
      return { current: 0, longest: 0, totalDays: 0 };
    }

    const today = new Date().toISOString().split('T')[0];
    const sortedDays = [...habit.completedDays].sort();
    const totalDays = sortedDays.length;

    // Find streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let currentStreakStart = null;

    // Check if today is completed
    const isTodayCompleted = sortedDays.includes(today);

    // Calculate current streak
    if (isTodayCompleted) {
      currentStreak = 1;
      let dateToCheck = parseISO(today);
      
      while (true) {
        dateToCheck = subDays(dateToCheck, 1);
        const dateString = dateToCheck.toISOString().split('T')[0];
        
        if (sortedDays.includes(dateString)) {
          currentStreak++;
        } else {
          break;
        }
      }
    } else if (sortedDays.length > 0) {
      // Check if the last completion was yesterday
      const lastCompletionDate = parseISO(sortedDays[sortedDays.length - 1]);
      const yesterday = subDays(new Date(), 1);
      
      if (format(lastCompletionDate, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
        currentStreak = 1;
        let dateToCheck = lastCompletionDate;
        
        while (true) {
          dateToCheck = subDays(dateToCheck, 1);
          const dateString = dateToCheck.toISOString().split('T')[0];
          
          if (sortedDays.includes(dateString)) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    // Calculate longest streak
    let tempStreak = 1;
    for (let i = 1; i < sortedDays.length; i++) {
      const currentDate = parseISO(sortedDays[i]);
      const prevDate = parseISO(sortedDays[i - 1]);
      
      if (differenceInDays(currentDate, prevDate) === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    }

    return { current: currentStreak, longest: longestStreak, totalDays };
  };

  // Prepare data for the heatmap
  const getHeatmapData = (habit) => {
    if (!habit) return [];
    
    const completedDays = habit.completedDays || [];
    const { startDate, endDate } = calculateDateRange();
    
    // Filter days that are within our view range
    const filteredDays = completedDays.filter(day => {
      const date = parseISO(day);
      return isWithinInterval(date, { start: startDate, end: endDate });
    });
    
    return filteredDays.map(day => ({
      date: day,
      count: 1
    }));
  };
  
  // Get color based on value
  const getColor = (value) => {
    if (!value) return 'color-scale-1';
    return 'color-scale-4';
  };
  
  // Update calendar data and streak information when habit or date range changes
  useEffect(() => {
    if (habits.length > 0) {
      const habit = habits.find(h => h.id === selectedHabit) || habits[0];
      setCalendarData(getHeatmapData(habit));
      setStreakStats(calculateStreakInfo(habit));
    } else {
      setCalendarData([]);
      setStreakStats({ current: 0, longest: 0, totalDays: 0 });
    }
  }, [selectedHabit, viewRange, habits]);
  
  // Format date for tooltip
  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'dd MMMM yyyy', { locale: ca });
  };

  return (
    <div className="calendar-container">
      <div className="card">
        <h2 className="calendar-header">Calendari de Progrés</h2>
        
        <div className="calendar-controls">
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
          
          <div className="form-group">
            <label htmlFor="view-range">Període:</label>
            <select
              id="view-range"
              value={viewRange}
              onChange={(e) => setViewRange(e.target.value)}
            >
              <option value="month">Últims 30 dies</option>
              <option value="quarter">Últims 90 dies</option>
              <option value="year">Any actual</option>
            </select>
          </div>
        </div>
        
        <div className="streak-summary">
          <div className="streak-item">
            <span className="streak-icon">🔥</span>
            <div className="streak-info">
              <span className="streak-value">{streakStats.current}</span>
              <span className="streak-label">Racha actual</span>
            </div>
          </div>
          <div className="streak-item">
            <span className="streak-icon">🏆</span>
            <div className="streak-info">
              <span className="streak-value">{streakStats.longest}</span>
              <span className="streak-label">Millor racha</span>
            </div>
          </div>
          <div className="streak-item">
            <span className="streak-icon">✅</span>
            <div className="streak-info">
              <span className="streak-value">{streakStats.totalDays}</span>
              <span className="streak-label">Total completats</span>
            </div>
          </div>
        </div>
        
        <div className="habit-calendar">
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={calendarData}
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
