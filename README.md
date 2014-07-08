chrome_google_calendar_tool
===========================

Chrome Extension for Google Calendar
Implemented a chrome extension to provide a faster way of adding new event to Google Calendar. User can easily add, review, modify or delete existing events through context menu and extension popup. To better interact with user, a JQuery-UI based dialog box with input field, date and time picker is injected into host tab. It runs a background page listening to UI event from content script and popup page, sending asynchronous API call, receiving response from Google Calendar restful service. The privacy and security of user information are guaranteed by using OAuth 2.0 protocol.


You can find this extension from Google web store:
https://chrome.google.com/webstore/detail/calendar%2B%2B/ihjcgjffllcalnmoaggmalnjpbnnbchc/related
