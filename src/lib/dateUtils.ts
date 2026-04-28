export const getWeekDates = () => {
  const dates = [];
  const startOfWeek = new Date(); // Start at "Today"
  
  // Move to the nearest past Sunday
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    dates.push({
      date: day.getDate(),
      dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
      fullDate: day.toISOString().split('T')[0],
      isToday: day.toDateString() === new Date().toDateString(),
    });
  }
  return dates;
};