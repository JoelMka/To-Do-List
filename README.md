# Joel's Daily Planner

A comprehensive daily planner application designed specifically for Joel Mathew with a homely, warm interface and personalized features.

## Features

### 🏠 Home Page
- **Welcome Section**: Personalized greeting with current date and time
- **Today's Schedule**: Shows your daily routine:
  - **Gym Workout**: 6:00 AM - 8:00 AM (Monday-Saturday)
  - **College**: 9:00 AM - 4:30 PM (Monday-Saturday)
- **Workout Schedule**: Automatically displays today's workout based on your schedule:
  - Monday: Chest & Triceps
  - Tuesday: Back & Biceps
  - Wednesday: Shoulders & Abs
  - Thursday: Legs
  - Friday: Chest & Back
  - Saturday: Arms & Legs
  - Sunday: Rest Day
- **Quick Actions**: Easy access to add events, set reminders, and view today's tasks
- **Upcoming Events**: Shows your next 5 scheduled events

### 📅 Calendar
- **Monthly View**: Interactive calendar with navigation
- **Event Management**: Add events with details like:
  - Event title
  - Date and time
  - Event type (Homework, Exam, Meeting, Personal, Other)
  - Description
  - Optional reminder setting
- **Visual Indicators**: Days with events are marked with dots
- **Click to View**: Click on any day to see scheduled events

### 🔔 Reminders
- **Set Reminders**: Create reminders with:
  - Title and description
  - Date and time
  - Priority level (Low, Medium, High)
- **Priority Colors**: 
  - High Priority: Red border
  - Medium Priority: Orange border
  - Low Priority: Green border
- **Automatic Notifications**: Reminders pop up when due
- **Manage Reminders**: Delete reminders as needed

## How to Use

### Getting Started
1. Open `index.html` in your web browser
2. The application will load with your personalized schedule
3. Navigate between sections using the top navigation bar

### Adding Events
1. Click on the **Calendar** tab
2. Fill out the "Add New Event" form:
   - Enter event title
   - Select date and time
   - Choose event type
   - Add description (optional)
   - Check "Set Reminder" if you want a notification
3. Click "Add Event"

### Setting Reminders
1. Click on the **Reminders** tab
2. Click "Add Reminder" button
3. Fill out the reminder form:
   - Enter reminder title
   - Select date and time
   - Add description (optional)
   - Choose priority level
4. Click "Add Reminder"

### Viewing Your Schedule
- **Home Page**: See today's workout and upcoming events
- **Calendar**: Click on any day to view events for that day
- **Today's Tasks**: Use the "Today's Tasks" button to see what's scheduled for today

## Technical Details

### Storage
- All events and reminders are stored in your browser's localStorage
- Data persists between sessions
- No internet connection required

### Notifications
- Reminders check every minute
- Notifications appear in the top-right corner
- Auto-dismiss after 5 seconds
- Duplicate notifications are prevented (shows once every 5 minutes)

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Adapts layout for different screen sizes

## File Structure
```
To Do/
├── index.html      # Main HTML file
├── styles.css      # CSS styling with homely design
├── script.js       # JavaScript functionality
└── README.md       # This file
```

## Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Personalization
The application is pre-configured with Joel's schedule:
- Gym workouts every day except Sunday (6:00 AM - 8:00 AM)
- College schedule (9:00 AM - 4:30 PM)
- Specific workout routine for each day of the week

You can modify the workout schedule in `script.js` by editing the `workoutSchedule` object if needed.

## Tips for Best Experience
1. **Set Reminders**: Use the reminder feature for important deadlines
2. **Regular Updates**: Add events as soon as you know about them
3. **Priority Levels**: Use high priority for urgent tasks
4. **Descriptions**: Add details to events for better organization
5. **Check Daily**: Review your schedule each morning

Enjoy staying organized with your personalized daily planner! 🎯 