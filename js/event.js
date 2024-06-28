document.addEventListener('DOMContentLoaded', function() {

  (function() {
    'use strict';
    $('.hamburger-menu').click(function(e) {
      e.preventDefault();
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $('.menu .menu-list').slideToggle('slow', 'swing');
      } else {
        $(this).addClass('active');
        $('.menu .menu-list').slideToggle('slow', 'swing');
      }
    });
  })();

  async function fetchEvents() {
    console.log("fetchEvents");
    await connectWallet(); // Ensure wallet is connected before proceeding
    const eventManagerContract = await initializeEventContract(); // Ensure contract is initialized before calling methods

    let events = [];
    console.log('Provider before eventManagerContract:', provider);
    const eventCount = await eventManagerContract.getEventsCount();
    console.log(`fetch eventCount: ${JSON.stringify(eventCount, null, 2)}`);
    for (let i = 0; i < eventCount; i++) {
      const event = await eventManagerContract.getEventsByIndex(i);
      console.log(`fetch event: ${JSON.stringify(event, null, 2)}`);
      events.push({
        id: event.id.toNumber(),
        startDate: new Date(event.startTime * 1000).toISOString().split('T')[0],
        endDate: new Date(event.endTime * 1000).toISOString().split('T')[0],
        description: event.description,
        status: event.status,
        });
      }
    console.log(`fetch events: ${JSON.stringify(events, null, 2)}`);
    return events;
  }

  async function populateEventList(events) {
    // const events = fetchEvents();
    console.log(`events: ${JSON.stringify(events, null, 2)}`);
    const eventList = document.getElementById('event-list');

    events.forEach(event => {
      const listItem = document.createElement('li');
      listItem.className = 'event-item'; // Assigning a class to the list item
      listItem.innerHTML = `
      <div class="event-id">Event ID: <span>${event.id}</span></div>
      <div class="event-dates">Start Date: <span>${event.startDate}</span> | End Date: <span>${event.endDate}</span></div>
      <div class="event-description"> Description: <span>${event.description}</span></div>
      <div class="event-status"> ${event.status? 'Active' : 'Completed'} </div>
        `;
        listItem.addEventListener('click', () => handleEventSelection(event, listItem)); // Add click listener
        eventList.appendChild(listItem);
    });
}

function handleEventSelection(event, listItem) {
  console.log(`Event ${event.id} selected`);

  // Populate the form fields with the selected event's details
  document.getElementById('event-id').value = event.id.toString();
  document.getElementById('start-date').value = event.startDate;
  document.getElementById('end-date').value = event.endDate;
  document.getElementById('description').value = event.description.toString();
  document.getElementById('status').value = event.status? 'Active' : 'Completed';

  // Optionally, enable/disable buttons based on the action (create/update/delete)
  // For simplicity, we'll assume this is for updating a event
  // document.getElementById('update-event').disabled = false;
  // document.getElementById('create-event').disabled = true;
  // document.getElementById('delete-event').disabled = false;

  // Highlight the selected event in the list
  const eventItems = document.querySelectorAll('#event-list li');
  eventItems.forEach(item => item.classList.remove('selected'));
  listItem.classList.add('selected'); // Assuming listItem is the clicked element
}

async function initializeEventList() {
  console.log("initializeEventList");
  try {
    const events = await fetchEvents();
    console.log("const events = await fetchEvents();");
    await populateEventList(events);
  } catch (error) {
    console.error("Failed to fetch or populate events:", error);
  }
}

initializeEventList(); 



function clearFormFields() {
  // Select all input elements within the form
  var inputs = document.querySelectorAll('#event-form input');

  // Loop through each input element and set its value to an empty string
  inputs.forEach(function(input) {
    input.value = '';
  });

  // Clear the select dropdown
  var select = document.querySelector('#event-form select');
  select.selectedIndex = 0; // Reset to the first option
}

// Example usage: Call clearFormFields() when needed, e.g., after submitting the form
// Or, you can attach it to a button click event like so:
document.getElementById('new-event').addEventListener('click', clearFormFields);

async function updateEvent(seventId, sstartDate, sendDate, description) {
  await connectWallet(); // Ensure wallet is connected before proceeding
  const eventManagerContract = await initializeEventContract(); // Ensure contract is initialized before calling methods

  const eventId = parseInt(seventId, 10);
  const dstartDate= new Date(sstartDate);
  const startDate = Math.floor(dstartDate.getTime() / 1000);
  const dendDate= new Date(sendDate);
  const endDate= Math.floor(dendDate.getTime() / 1000);

  const eventcontracttx = eventManagerContract.updateEvents(eventId, startDate, endDate, description)
  console.log(`event Transaction hash: ${eventcontracttx.hash}`);
}

document.getElementById('update-event').addEventListener('click', function() {
  // Retrieve values from the form fields
  const eventId = document.getElementById('event-id').value;
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;
  const description = document.getElementById('description').value;

  // Call the updateEvent function with the retrieved values
  updateEvent(eventId, startDate, endDate, description);
});

async function deleteEvent(seventId) {

  const eventId = parseInt(seventId, 10);
  const eventManagerContract = await initializeEventContract(); // Ensure contract is initialized before calling methods
  const eventcontracttx = eventManagerContract.deleteEvents(eventId)
  console.log(`event Transaction hash: ${eventcontracttx.hash}`);
}

document.getElementById('delete-event').addEventListener('click', function() {
  // Retrieve values from the form fields
  const eventId = document.getElementById('event-id').value;
  deleteEvent(eventId);
});

const eventform = document.getElementById('create-event');
if (eventform) {
  eventform.addEventListener('click', async function() {
    event.preventDefault();
    const seventId = document.getElementById('event-id').value;
    const eventId = parseInt(seventId, 10);
    const sstartDate= document.getElementById('start-date').value;
    const dstartDate= new Date(sstartDate);
    const startDate = Math.floor(dstartDate.getTime() / 1000);
    const sendDate= document.getElementById('end-date').value;
    const dendDate= new Date(sendDate);
    const endDate= Math.floor(dendDate.getTime() / 1000);
    const description = document.getElementById('description').value;


    const eventManagerContract = await initializeEventContract(); // Ensure contract is initialized before calling methods
    try {
      const txResponse = await eventManagerContract.createEvents(startDate, endDate, description)
      console.log(`event Transaction hash: ${txResponse.hash}`);

      await txResponse.wait(); // Wait for the transaction to be mined

      console.log('event Transaction mined successfully.');

      // Extract the event logs from the transaction receipt
      console.log('Provider before getTransactionReceipt:', provider);
      const receipt = await provider.getTransactionReceipt(txResponse.hash);
      console.log(`event receipt: ${receipt}`);

      // Filter out the EventCreated event logs
      const iface = new ethers.utils.Interface([
        "event EventsCreated(uint256 eventId, uint256 startDate, uint256 endDate, string description)"
        ]);
      const eventCreatedLogs = receipt.logs.filter(log => {
        try {
          iface.parseLog(log);
          console.log("iface.parseLog(log);");
          return true;
          } catch (error) {
            console.log("failed iface.parseLog(log);");
            return false;
            }
        });
      if (eventCreatedLogs.length > 0) {
        const log = eventCreatedLogs[0];
        const parsedLog = iface.parseLog(log);
        if (parsedLog && parsedLog.args) {
          const { args } = parsedLog;
          console.log(`EventsCreated emitted with Events ID: ${args.eventsId?.toString()}, Events ID: ${args.eventsId?.toString()}, Start Time: ${args.startDate?.toString()}, End Time: ${args.endDate?.toString()}, Required Interactions: ${args.requiredInteractions?.toString()}, Reward Type: ${args.rewardType}`);
          alert('Event Created');
          } else {
            console.log('EventsCreated event not found in transaction receipt or failed to parse.');
            }

        } else {
          console.log('EventsCreated event not found in transaction receipt.');
          }

      } 
    catch (error) {
      console.error('Error creating event:', error.message);
      }
    });
  } else {
    console.error('Element with ID "create-event" not found');
    }
  });
