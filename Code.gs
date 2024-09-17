// Delete 加油 ("jiā yóu") Events
// WARNING: Deleted events are not recoverable! Once they are deleted, they are gone forever!
// Modify the following search parameters, then press |> Run

// Search parameters
var myCalendarName = "JIA YOU"; // Must name it differently from the owner name
var myNewQuery = "Updated Meeting"; // Event you want to delete, query ignores any extra spacing
var myNewQueryAdd = "J Day"; // Input additional query to confine search, query ignores any extra spacing
var myNewStart = ""; // Confine date range
var myNewEnd = ""; // Confine date range
// Accepted date formats: Mmm DD YYYY, MM/DD/YYYY, DD Mmm YYYY
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
      // Logger.log(
      //   'Calendar ID for "' + calendarName + '": ' + calendars[i].getId()
      // );
      calendarId = String(calendars[i].getId()); // Assign the calendar ID
    }
  }

  // Check if loop finds no calendar
  if (calendarId === "") {
    return "No \"" + calendarName + "\" calendar exists!";
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
    var events = calendar.getEvents(myNewStart, myNewEnd, { search: query });

    // Check additional query
    if (queryAdd !== "") {
      var eventsAdd = calendar.getEvents(myNewStart, myNewEnd, { search: queryAdd });
    }
  } else {
    // Set the search parameters
    var query = myNewQuery;
    var queryAdd = myNewQueryAdd;
    var now = new Date();
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    // Search for events between now and one year from now
    var events = calendar.getEvents(now, oneYearFromNow, { search: query });

    // Check additional query
    if (queryAdd !== "") {
      var eventsAdd = calendar.getEvents(now, oneYearFromNow, {
        search: queryAdd,
      });
    }
  }

  // Check if query finds no events
  if (events.length === 0) {
    return "No \"" + query + "\" events exist!";
  }
  // Check if queryAdd finds no events
  if (queryAdd !== "" && eventsAdd.length === 0) {
    return "No \"" + queryAdd + "\" events exist!";
  }

  // Check if query and queryAdd find no matching events below
  var match = "no";

  if (queryAdd !== "") {
    // Loop through each event found
    events.forEach(function(event) {
      var eventDate = event.getStartTime();

      // Extract just the date part as a string
      eventDate = eventDate.toDateString();

      // Loop through each event found, again
      eventsAdd.forEach(function(eventAdd) {
        var eventDateAdd = eventAdd.getStartTime();

        // Extract just the date part as a string, again
        eventDateAdd = eventDateAdd.toDateString();

        // Find matches
        if (eventDate === eventDateAdd) {
          // Delete the event
          if (!myNewDryRun) {
            event.deleteEvent(); // Gone forever!
          }

          match = "yes";

          // Log which events were deleted
          Logger.log("Deleted an event on " + eventDate + ".");
        }
      });
    });
    if (match === "no") {
      return "No \"" + query + "\" and \"" + queryAdd + "\" events match!";
    }
    else {
      return "Events deleted!";
    }
  } else {
    // Loop through each event found
    events.forEach(function(event) {
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
    return "Events deleted!";
  }
}
