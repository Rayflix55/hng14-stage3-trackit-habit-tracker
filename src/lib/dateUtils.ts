export const getWeekDates = () => {
  const dates = [];
  const now = new Date();
  const todayStr = now.toDateString();


  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);

    //  Format fullDate manually to avoid UTC shifting
    const year = day.getFullYear();
    const month = String(day.getMonth() + 1).padStart(2, '0');
    const dateNum = String(day.getDate()).padStart(2, '0');
    const fullDate = `${year}-${month}-${dateNum}`;

    dates.push({
      date: day.getDate(),
      dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
      fullDate: fullDate,
      isToday: day.toDateString() === todayStr,
    });
  }
  return dates;
};