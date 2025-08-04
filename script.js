// Global variables
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let events = JSON.parse(localStorage.getItem('events')) || [];
let reminders = JSON.parse(localStorage.getItem('reminders')) || [];

// Joel's workout schedule
const workoutSchedule = {
    1: "Chest & Triceps", // Monday
    2: "Back & Biceps",   // Tuesday
    3: "Shoulders & Abs", // Wednesday
    4: "Legs",            // Thursday
    5: "Chest & Back",    // Friday
    6: "Arms & Legs"      // Saturday
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    updateTodayWorkout();
    renderCalendar();
    renderUpcomingEvents();
    renderReminders();
    checkReminders();
    
    // Set up form event listeners
    document.getElementById('eventForm').addEventListener('submit', handleEventSubmit);
    document.getElementById('reminderForm').addEventListener('submit', handleReminderSubmit);
    
    // Check reminders every minute
    setInterval(checkReminders, 60000);
});

// Update current time display
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('currentTime').textContent = `${dateString} | ${timeString}`;
}

// Update today's workout display
function updateTodayWorkout() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    if (dayOfWeek === 0) { // Sunday
        document.getElementById('todayWorkout').textContent = 'Rest Day';
        document.querySelector('.schedule-item.gym').style.opacity = '0.5';
    } else {
        const workout = workoutSchedule[dayOfWeek];
        document.getElementById('todayWorkout').textContent = workout;
        document.querySelector('.schedule-item.gym').style.opacity = '1';
    }
}

// Navigation functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Update calendar if showing calendar section
    if (sectionName === 'calendar') {
        renderCalendar();
    }
}

// Calendar functions
function renderCalendar() {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDay = firstDay.getDay();
    const monthLength = lastDay.getDate();
    
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    document.getElementById('currentMonth').textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendarDays.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= monthLength; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const currentDateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Check if it's today
        const today = new Date();
        if (currentYear === today.getFullYear() && 
            currentMonth === today.getMonth() && 
            day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // Check if day has events
        const dayEvents = events.filter(event => event.date === currentDateString);
        if (dayEvents.length > 0) {
            dayElement.classList.add('has-event');
            dayElement.title = dayEvents.map(event => event.title).join('\n');
        }
        
        // Add click event to show events for the day
        dayElement.addEventListener('click', () => showDayEvents(currentDateString, dayEvents));
        
        calendarDays.appendChild(dayElement);
    }
}

function previousMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function showDayEvents(date, dayEvents) {
    // Set the selected date in the form
    document.getElementById('eventDate').value = date;
    
    // Show the calendar section
    showSection('calendar');
    
    // Create and show the day events modal
    const modal = document.createElement('div');
    modal.className = 'day-events-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}</h3>
                <button class="close-btn" onclick="closeDayEventsModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="events-for-day">
                    <h4>Events for this day:</h4>
                    <div id="dayEventsList">
                        ${dayEvents.length === 0 ? '<p style="color: #666; text-align: center;">No events scheduled for this day.</p>' : ''}
                    </div>
                    ${dayEvents.map(event => `
                        <div class="day-event-item">
                            <div class="event-info">
                                <h5>${event.title}</h5>
                                ${event.time ? `<p><i class="fas fa-clock"></i> ${event.time}</p>` : ''}
                                ${event.description ? `<p>${event.description}</p>` : ''}
                                <span class="event-type-badge ${event.type}">${event.type}</span>
                            </div>
                            <div class="event-actions">
                                <button onclick="deleteEvent(${event.id})" title="Delete Event">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="add-event-for-day">
                    <h4>Add New Event for this day:</h4>
                    <form id="quickEventForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="quickEventTitle">Event Title:</label>
                                <input type="text" id="quickEventTitle" required>
                            </div>
                            <div class="form-group">
                                <label for="quickEventTime">Time:</label>
                                <input type="time" id="quickEventTime">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="quickEventType">Type:</label>
                                <select id="quickEventType">
                                    <option value="homework">Homework</option>
                                    <option value="exam">Exam</option>
                                    <option value="meeting">Meeting</option>
                                    <option value="personal">Personal</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="quickEventDescription">Description:</label>
                                <input type="text" id="quickEventDescription">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="quickSetReminder"> Set Reminder
                            </label>
                        </div>
                        <div class="form-buttons">
                            <button type="submit" class="submit-btn">Add Event</button>
                            <button type="button" class="cancel-btn" onclick="closeDayEventsModal()">Close</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listener for the quick event form
    document.getElementById('quickEventForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const eventData = {
            id: Date.now(),
            title: document.getElementById('quickEventTitle').value,
            date: date,
            time: document.getElementById('quickEventTime').value,
            type: document.getElementById('quickEventType').value,
            description: document.getElementById('quickEventDescription').value,
            hasReminder: document.getElementById('quickSetReminder').checked
        };
        
        events.push(eventData);
        localStorage.setItem('events', JSON.stringify(events));
        
        // If reminder is checked, create a reminder
        if (eventData.hasReminder) {
            const reminderData = {
                id: Date.now() + 1,
                title: `Reminder: ${eventData.title}`,
                date: eventData.date,
                time: eventData.time || '09:00',
                description: eventData.description,
                priority: 'medium',
                type: 'event'
            };
            
            reminders.push(reminderData);
            localStorage.setItem('reminders', JSON.stringify(reminders));
        }
        
        e.target.reset();
        closeDayEventsModal();
        renderCalendar();
        renderUpcomingEvents();
        renderReminders();
        
        showNotification('Event added successfully!', 'success');
    });
}

function closeDayEventsModal() {
    const modal = document.querySelector('.day-events-modal');
    if (modal) {
        modal.remove();
    }
}

function deleteEvent(id) {
    events = events.filter(event => event.id !== id);
    localStorage.setItem('events', JSON.stringify(events));
    
    // Refresh the modal with updated events
    const date = document.getElementById('eventDate').value;
    const dayEvents = events.filter(event => event.date === date);
    
    // Update the events list in the modal
    const dayEventsList = document.getElementById('dayEventsList');
    if (dayEventsList) {
        dayEventsList.innerHTML = '';
        dayEvents.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.className = 'day-event-item';
            eventElement.innerHTML = `
                <div class="event-info">
                    <h5>${event.title}</h5>
                    ${event.time ? `<p><i class="fas fa-clock"></i> ${event.time}</p>` : ''}
                    ${event.description ? `<p>${event.description}</p>` : ''}
                    <span class="event-type-badge ${event.type}">${event.type}</span>
                </div>
                <div class="event-actions">
                    <button onclick="deleteEvent(${event.id})" title="Delete Event">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            dayEventsList.appendChild(eventElement);
        });
    }
    
    renderCalendar();
    renderUpcomingEvents();
    showNotification('Event deleted!', 'info');
}

// Event management
function handleEventSubmit(e) {
    e.preventDefault();
    
    const eventData = {
        id: Date.now(),
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        type: document.getElementById('eventType').value,
        description: document.getElementById('eventDescription').value,
        hasReminder: document.getElementById('setReminder').checked
    };
    
    events.push(eventData);
    localStorage.setItem('events', JSON.stringify(events));
    
    // If reminder is checked, create a reminder
    if (eventData.hasReminder) {
        const reminderData = {
            id: Date.now() + 1,
            title: `Reminder: ${eventData.title}`,
            date: eventData.date,
            time: eventData.time || '09:00',
            description: eventData.description,
            priority: 'medium',
            type: 'event'
        };
        
        reminders.push(reminderData);
        localStorage.setItem('reminders', JSON.stringify(reminders));
    }
    
    e.target.reset();
    renderCalendar();
    renderUpcomingEvents();
    renderReminders();
    
    showNotification('Event added successfully!', 'success');
}

function renderUpcomingEvents() {
    const upcomingEventsList = document.getElementById('upcomingEventsList');
    upcomingEventsList.innerHTML = '';
    
    const today = new Date();
    const upcomingEvents = events
        .filter(event => new Date(event.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
    
    if (upcomingEvents.length === 0) {
        upcomingEventsList.innerHTML = '<p style="color: #666; text-align: center;">No upcoming events</p>';
        return;
    }
    
    upcomingEvents.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-item';
        
        const eventDate = new Date(event.date);
        const dateString = eventDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        
        eventElement.innerHTML = `
            <h3>${event.title}</h3>
            <p>${dateString}${event.time ? ` at ${event.time}` : ''}</p>
            ${event.description ? `<p>${event.description}</p>` : ''}
        `;
        
        upcomingEventsList.appendChild(eventElement);
    });
}

// Reminder management
function showAddReminderForm() {
    document.getElementById('addReminderForm').classList.remove('hidden');
}

function hideAddReminderForm() {
    document.getElementById('addReminderForm').classList.add('hidden');
    document.getElementById('reminderForm').reset();
}

function handleReminderSubmit(e) {
    e.preventDefault();
    
    const reminderData = {
        id: Date.now(),
        title: document.getElementById('reminderTitle').value,
        date: document.getElementById('reminderDate').value,
        time: document.getElementById('reminderTime').value,
        description: document.getElementById('reminderDescription').value,
        priority: document.getElementById('reminderPriority').value,
        type: 'reminder'
    };
    
    reminders.push(reminderData);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    
    e.target.reset();
    hideAddReminderForm();
    renderReminders();
    
    showNotification('Reminder added successfully!', 'success');
}

function renderReminders() {
    const remindersList = document.getElementById('remindersList');
    remindersList.innerHTML = '';
    
    if (reminders.length === 0) {
        remindersList.innerHTML = '<p style="color: #666; text-align: center;">No reminders set</p>';
        return;
    }
    
    const sortedReminders = reminders.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA - dateB;
    });
    
    sortedReminders.forEach(reminder => {
        const reminderElement = document.createElement('div');
        reminderElement.className = `reminder-item ${reminder.priority}-priority`;
        
        const reminderDate = new Date(`${reminder.date} ${reminder.time}`);
        const isPast = reminderDate < new Date();
        
        if (isPast) {
            reminderElement.style.opacity = '0.6';
        }
        
        const dateString = reminderDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        
        const timeString = reminderDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        reminderElement.innerHTML = `
            <div class="reminder-content">
                <h3>${reminder.title}</h3>
                <p>${dateString} at ${timeString}</p>
                ${reminder.description ? `<p>${reminder.description}</p>` : ''}
            </div>
            <div class="reminder-actions">
                <button onclick="deleteReminder(${reminder.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        remindersList.appendChild(reminderElement);
    });
}

function deleteReminder(id) {
    reminders = reminders.filter(reminder => reminder.id !== id);
    localStorage.setItem('reminders', JSON.stringify(reminders));
    renderReminders();
    showNotification('Reminder deleted!', 'info');
}

function checkReminders() {
    const now = new Date();
    const currentTime = now.getTime();
    
    reminders.forEach(reminder => {
        const reminderTime = new Date(`${reminder.date} ${reminder.time}`).getTime();
        const timeDiff = reminderTime - currentTime;
        
        // Check if reminder is due (within 1 minute and not more than 1 hour ago)
        if (timeDiff <= 60000 && timeDiff > -3600000) {
            // Check if we haven't already shown this reminder recently
            const reminderKey = `reminder_${reminder.id}`;
            const lastShown = localStorage.getItem(reminderKey);
            const lastShownTime = lastShown ? parseInt(lastShown) : 0;
            
            if (currentTime - lastShownTime > 300000) { // Show once every 5 minutes
                showNotification(`Reminder: ${reminder.title}`, 'reminder');
                localStorage.setItem(reminderKey, currentTime.toString());
            }
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notificationContainer = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notificationContainer.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Utility functions
function viewTodayTasks() {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const todayEvents = events.filter(event => event.date === todayString);
    
    if (todayEvents.length === 0) {
        showNotification('No tasks scheduled for today!', 'info');
    } else {
        let message = 'Today\'s tasks:\n\n';
        todayEvents.forEach(event => {
            message += `• ${event.title}`;
            if (event.time) message += ` (${event.time})`;
            message += '\n';
        });
        showNotification(message, 'info');
    }
}

// Set default date to today for forms
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('eventDate').value = today;
    document.getElementById('reminderDate').value = today;
}); 