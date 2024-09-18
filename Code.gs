// Delete 加油 ("jiā yóu") Events
// WARNING: Deleted events are not recoverable! Once they are deleted, they are gone forever!
// Modify the following search parameters, then press |> Run

// Search parameters
var myCalendarName = "JIA YOU"; // Must name it differently from the owner name
var myNewQuery = "Updated Meeting"; // Event you want to delete
var myNewQueryAdd = "J Day"; // Input additional query to confine search
var myNewStart = ""; // Confine date range
var myNewEnd = ""; // Confine date range
// Accepted date formats: Mmm DD YYYY, MM/DD/YYYY, DD Mmm YYYY
// Why not accept YYYY/MM/DD ? Because it defaults to Coordinated Universal Time
var myNewDryRun = false; // test script before running it in production





// -----------------------------------------------------------------------------------
// ** WARNING **
// If the script below is modified improperly, running it may cause irrevocable damage.
// The script below comes with absolutely no warranty. Use it at your own risk.

function deleteEvents() {
  var calendarName = myCalendarName;
  var calendars = CalendarApp.getAllCalendars(); // Get all calendars
  var calendarId = ""; // Initially null

  // Loop through all calendars and find the one with the matching name
  for (var i = 0; i < calendars.length; i++) {
    if (calendars[i].getName() === calendarName) {
      calendarId = String(calendars[i].getId()); // Assign the calendar ID
    }
  }

  // Check if loop finds no calendar
  if (calendarId === "") {
    Logger.log('No "' + calendarName + '" calendar exists!');
    return null;
  }

  // Access the calendar
  var calendar = CalendarApp.getCalendarById(calendarId);

  // Check for null dates
  if (myNewStart !== "" && myNewEnd !== "") {
    // Set the search parameters
    var query = myNewQuery;
    var queryAdd = myNewQueryAdd;
    myNewStart = new Date(myNewStart);
    myNewEnd = new Date(myNewEnd); // excluded from search
    myNewEnd.setDate(myNewEnd.getDate() + 1); // include end date in search

    // Search for events between start and end dates
    var eventsAll = calendar.getEvents(myNewStart, myNewEnd);
    var events = [];
    for (var j = 0; j < eventsAll.length; j++) {
      var event = eventsAll[j];
      if (event.getTitle() === query) {
        // MORE RELIABLE!
        events.push(event);
      }
    }

    // Check additional query
    if (queryAdd !== "") {
      var eventsAddAll = calendar.getEvents(myNewStart, myNewEnd);
      var eventsAdd = [];
      for (var k = 0; k < eventsAddAll.length; k++) {
        var event = eventsAddAll[k];
        if (event.getTitle() === queryAdd) {
          eventsAdd.push(event);
        }
      }
    }
  } else {
    // Set the search parameters
    var query = myNewQuery;
    var queryAdd = myNewQueryAdd;
    var now = new Date();
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    // Search for events between now and one year from now
    var eventsAll = calendar.getEvents(now, oneYearFromNow);
    var events = [];
    for (var l = 0; l < eventsAll.length; l++) {
      var event = eventsAll[l];
      if (event.getTitle() === query) {
        events.push(event);
      }
    }

    // Check additional query
    if (queryAdd !== "") {
      var eventsAddAll = calendar.getEvents(now, oneYearFromNow);
      var eventsAdd = [];
      for (var m = 0; m < eventsAddAll.length; m++) {
        var event = eventsAddAll[m];
        if (event.getTitle() === queryAdd) {
          eventsAdd.push(event);
        }
      }
    }
  }

  // Check if query finds no events
  if (events.length === 0) {
    Logger.log('No "' + query + '" events exist!');
    return null;
  }
  // Check if queryAdd finds no events
  if (queryAdd !== "" && eventsAdd.length === 0) {
    Logger.log('No "' + queryAdd + '" events exist!');
    return null;
  }

  // Check if query and queryAdd find no matching events below
  var match = false;

  if (queryAdd !== "") {
    // Loop through each event found
    events.forEach(function (event) {
      var eventDate = event.getStartTime();

      // Extract just the date part as a string
      eventDate = eventDate.toDateString();

      // Loop through each event found, again
      eventsAdd.forEach(function (eventAdd) {
        var eventDateAdd = eventAdd.getStartTime();

        // Extract just the date part as a string, again
        eventDateAdd = eventDateAdd.toDateString();

        // Find matches
        if (eventDate === eventDateAdd) {
          // Delete the event
          if (!myNewDryRun) {
            event.deleteEvent(); // Gone forever!
          }

          match = true;

          // Log which events were deleted
          Logger.log("Deleted an event on " + eventDate + ".");
        }
      });
    });
    if (match === false) {
      Logger.log('No "' + query + '" and "' + queryAdd + '" events match!');
      return null;
    } else {
      Logger.log("Events deleted!");
      return null;
    }
  } else {
    // Loop through each event found
    events.forEach(function (event) {
      var eventDate = event.getStartTime();

      // Extract just the date part as a string
      eventDate = eventDate.toDateString();

      // Delete the event
      if (!myNewDryRun) {
        event.deleteEvent(); // Gone forever!
      }

      // Log which events were deleted
      Logger.log("Deleted an event on " + eventDate + ".");
    });
    Logger.log("Events deleted!");
    return null;
  }
}
