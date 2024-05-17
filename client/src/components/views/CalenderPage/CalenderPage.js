// import React, { useState } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import axios from 'axios';

// const CalendarPage = () => {
//   const [events, setEvents] = useState([
//     { title: 'Event 1', date: '2024-05-14' },
//     { title: 'Event 2', date: '2024-05-21' }
//   ]);

//   const handleDateClick = async (arg) => {
//     const newEvent = {
//       title: 'New Event',
//       date: arg.dateStr
//     };

//     // Optionally send newEvent to server
//     try {
//       const response = await axios.post('/api/event/add', newEvent, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });

//       if (response.data.success) {
//         setEvents([...events, newEvent]);
//       } else {
//         alert('Failed to add event');
//       }
//     } catch (error) {
//       console.error('Error adding event:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>My Calendar</h2>
//       <FullCalendar
//         plugins={[dayGridPlugin]}
//         initialView="dayGridMonth"
//         weekends={true}
//         events={events}
//         dateClick={handleDateClick}  // Clicking a date adds a new event
//       />
//     </div>
//   );
// };

// export default CalendarPage;