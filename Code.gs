// Modify the calendar name and search query as desired
// WARNING: Deleted events are not recoverable! Once they are deleted, they are gone forever!

var myCalendarName = "JIA YOU"; // Must name it differently from the owner name
var myNewQuery = "Updated Meeting"; // Query ignores any extra spacing
var myNewStart = ""; // Confine date range
var myNewEnd = ""; // Confine date range
// Accepted date formats: Mmm DD YYYY; MM/DD/YYYY; DD Mmm YYYY



// ** WARNING **
// If the script below is modified improperly, running it may cause irrevocable damage.
// The script below comes with absolutely no warranty. Use it at your own risk.

function deleteEvents() {
  var calendarName = myCalendarName;
  var calendars = CalendarApp.getAllCalendars();  // Get all calendars
  
  // Loop through all calendars and find the one with the matching name
  for (var i = 0; i < calendars.length; i++) {
    if (calendars[i].getName() === calendarName) {
      Logger.log("Calendar ID for \"" + calendarName + "\": " + calendars[i].getId());
      var calendarId = String(calendars[i].getId());  // Assign the calendar ID
    }
  }

  // Access the calendar
  var calendar = CalendarApp.getCalendarById(calendarId);
  
  // Check for null dates
  if (myNewStart !== "" && myNewEnd !== "") {
    // Set the search parameters
    var query = myNewQuery;
    myNewStart = new Date(myNewStart);
    myNewEnd = new Date(myNewEnd); // excluded from search
    myNewEnd.setDate(myNewEnd.getDate() + 1); // include end date in search

    // Search for events between start and end dates
    var events = calendar.getEvents(myNewStart, myNewEnd, {search: query});
  }
  else {
    // Set the search parameters
    var query = myNewQuery;
    var now = new Date();
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);
    
    // Search for events between now and one year from now
    var events = calendar.getEvents(now, oneYearFromNow, {search: query});
  }
  
  // Loop through each event found
  events.forEach(function(event) {
    var eventDate = event.getStartTime();

    // Extract just the date part as a string
    eventDate = eventDate.toDateString(); // Not storing the date in a dictionary

    // Cast "eventDate" as a function
    eventDate = new Date(eventDate);

    // Delete the event
    event.deleteEvent(); // Gone forever!

    // Log which events were deleted
    Logger.log("Deleted an event on " + eventDate + ".");

  }); 
}