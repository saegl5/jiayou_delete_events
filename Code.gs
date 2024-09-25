// WARNING: Deleted events are not recoverable! Once they are deleted, they are gone forever!

// ** EXTRA WARNING **
// If the script below is modified improperly, running it may cause irrevocable damage.
// The script below comes with absolutely no warranty. Use it at your own risk.

function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index");
}

function deleteEvents(
  calendarName,
  calendarNameAlt,
  query,
  queryAdd,
  start,
  end,
  dryRun
) {
  var calendars = CalendarApp.getAllCalendars(); // Get all calendars
  var calendarId = ""; // Initially null
  var calendarIdAlt = ""; // Initially null

  // Loop through all calendars and find the one with the matching name
  for (var i = 0; i < calendars.length; i++) {
    if (calendars[i].getName() === calendarName) {
      calendarId = String(calendars[i].getId()); // Assign the calendar ID
    }
  }

  // Check if loop finds no calendar
  if (calendarId === "") {
    return 'No "' + calendarName + '" calendar exists!';
  }

  // Repeat loop for alternate calendar (if one exists)
  if (calendarNameAlt !== "") {
    for (var j = 0; j < calendars.length; j++) {
      if (calendars[j].getName() === calendarNameAlt) {
        calendarIdAlt = String(calendars[j].getId()); // Assign the calendar ID
      }
    }
  }

  // Check if loop finds no calendar
  if (calendarNameAlt !== "" && calendarIdAlt === "") {
    return 'No "' + calendarNameAlt + '" calendar exists!';
  }

  // Access the calendar
  var calendar = CalendarApp.getCalendarById(calendarId);
  if (calendarNameAlt !== "") {
    var calendarAlt = CalendarApp.getCalendarById(calendarIdAlt);
  }

  // Check for null dates
  if (start !== "" && end !== "") {
    // Set the search parameters
    start = new Date(start);
    end = new Date(end); // excluded from search
    end.setDate(end.getDate() + 1); // include end date in search

    // Search for events between start and end dates
    if (calendarNameAlt !== "") {
      var eventsAll = calendarAlt.getEvents(start, end);
    } else {
      var eventsAll = calendar.getEvents(start, end);
    }
    var events = [];
    for (var j = 0; j < eventsAll.length; j++) {
      var event = eventsAll[j];
      if (event.getTitle() === query) {
        // MORE RELIABLE THAN `{ search: query }`!
        events.push(event);
      }
    }

    // Check additional query, always searches first calendar
    if (queryAdd !== "") {
      var eventsAddAll = calendar.getEvents(start, end);
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
    var now = new Date();
    var oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1); // sooner, if calendar cuts off

    // Search for events between now and one year from now
    if (calendarNameAlt !== "") {
      var eventsAll = calendarAlt.getEvents(now, oneYearFromNow);
    } else {
      var eventsAll = calendar.getEvents(now, oneYearFromNow);
    }
    var events = [];
    for (var l = 0; l < eventsAll.length; l++) {
      var event = eventsAll[l];
      if (event.getTitle() === query) {
        events.push(event);
      }
    }

    // Check additional query, always searches first calendar
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
    return 'No "' + query + '" events exist!';
  }
  // Check if queryAdd finds no events
  if (queryAdd !== "" && eventsAdd.length === 0) {
    return 'No "' + queryAdd + '" events exist!';
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
          // Delete the event and its guests
          if (!dryRun) {
            var guestList = event.getGuestList(true); // "true" includes owner
            for (const guest of guestList) {
              event.removeGuest(guest.getEmail());
            }
            event.deleteEvent(); // Gone forever!
          }

          match = true;

          // Log which events were deleted
          Logger.log(
            'Deleted "' + event.getTitle() + '" on ' + eventDate + "!"
          );
        }
      });
    });
    if (match === false) {
      return 'No "' + query + '" and "' + queryAdd + '" events match!';
    } else {
      return "Events deleted!";
    }
  } else {
    // Loop through each event found
    events.forEach(function (event) {
      var eventDate = event.getStartTime();

      // Extract just the date part as a string
      eventDate = eventDate.toDateString();

      // Delete the event and its guests
      if (!dryRun) {
        var guestList = event.getGuestList(true); // "true" includes owner
        for (const guest of guestList) {
          event.removeGuest(guest.getEmail());
        }
        event.deleteEvent(); // Gone forever!
      }

      // Log which events were deleted
      Logger.log('Deleted "' + event.getTitle() + '" on ' + eventDate + "!");
    });
    return "Events deleted!";
  }
}
