// Constants

const TOKEN = ``;
const BASE_URL = `https://api.telegram.org/bot${TOKEN}`;
const DEFAULT_CHAT_ID = '';
const DEPLOYED_URL = '';
const METHODS = {
  SEND_MESSAGE: 'sendMessage',
  SET_WEBHOOK: 'setWebhook',
  GET_UPDATES: 'getUpdates',
}

const SHEET_NAME = 'White Board';
const CACHE_ID_COL = 'I'; // Must not be A, B, C, D, E
const CACHE_TIME_COL = 'J'; // Must not be A, B, C, D, E
const CACHE_VAL_COL = 'K'; // Must not be A, B, C, D, E

// COLORS
const WHITE = 'white';
const RED = '#e06666';
const GREEN = '#93c47d';
const BLUE = '#6fa8dc';

// EMOJIS

const MAX_DESCRIPTION_LEN = 25;
const COMMANDS = {
  HELP: {
    command: 'help',
    description: 'Provides command infors',
    full_des: "For more information on a specific command, type 'HELP [command]'",
    syntax: 'HELP [command]',
    param_des: 'command - displays help information on that command.'
  },
  SET_REMINDER: {
    command: 'set',
    description: 'Set reminder',
    full_des: 'Schedule a message to be automatically sent at specific time',
    syntax: 'SET [time] [message]',
    param_des: `
      time - the desired time to send reminder, should be in long ISO 8601 format,
      ISO 8601 format: YYYY-MM-DDTHH:mm:ss,
      message - message to be sent.
    `
  }
}

// Emojis
const WARNING_EMOJI = '\u26A0️';
const ERROR_EMOJI = '\u2757\uFE0F';

// Utils

function toQueryParamsString(obj){
  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
}

function dictCheckKeyExist(key, dict) {
  return dict.hasOwnProperty(key);
}

function dictCheckValueExist(value, dict) {
  for (var key in dict) {
    if (dict.hasOwnProperty(key)) {
      if (dict[key].command === value) return true;
    }
  }
  return false;
}

// String formater

const monoText = (text) => {
  return '`' + text + '`';
}

const boldText = (text) => {
  return '**' + text + '**';
}

const italicText = (text) => {
  return '*' + text + '*';
}

const formatMoney = (value) => {
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

// Telegram APIs

const makeRequest = async (method, queryParams = {}) => {
  const url = `${BASE_URL}/${method}?${toQueryParamsString(queryParams)}`
  const response = await UrlFetchApp.fetch(url);
  return response.getContentText();
}

const sendMessage = (_text, _chat_id = DEFAULT_CHAT_ID) => {
  makeRequest(METHODS.SEND_MESSAGE, {
    chat_id: _chat_id,
    text: _text,
    parse_mode: 'Markdown'
  })
}

const sendWarning = (_text, _chat_id = DEFAULT_CHAT_ID) => {
  makeRequest(METHODS.SEND_MESSAGE, {
    chat_id: _chat_id,
    text: WARNING_EMOJI + _text,
    parse_mode: 'Markdown'
  })
}

const sendError = (_text, _chat_id = DEFAULT_CHAT_ID) => {
  makeRequest(METHODS.SEND_MESSAGE, {
    chat_id: _chat_id,
    text: ERROR_EMOJI + _text,
    parse_mode: 'Markdown'
  })
}

const getChatId = async () => {
  const res = await makeRequest(METHODS.GET_UPDATES);
  console.log("ChatId: ", JSON.parse(res)?.result[0]?.message?.chat?.id)
}

const setWebhook = () => {
  if (checkSheetExists(SHEET_NAME) === false) {
    createDataSheet();
  }

  makeRequest(METHODS.SET_WEBHOOK, {
    url: DEPLOYED_URL
  })
}

const deleteWebhook = () => {
  var url = "https://api.telegram.org/bot" + TOKEN + "/deleteWebhook";

  var response = UrlFetchApp.fetch(url);
  var responseData = JSON.parse(response.getContentText());

  if (responseData.ok) {
    Logger.log("Webhook deleted successfully.");
  } else {
    Logger.log("Error deleting webhook: " + responseData.error_code + " - " + responseData.description);
  }
}

// Sheet APIs

function createNewSheet(sheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  // Check if a sheet with sheetName exists
  var sheet = spreadsheet.getSheetByName(sheetName);
  if (sheet !== null) return sheet;

  // Create a new sheet with a specified name
  sheet = spreadsheet.insertSheet();
  sheet.setName(sheetName);

  return sheet;
}

function createDataSheet() {
  var dataSheet = createNewSheet(SHEET_NAME);
  dataSheet.setTabColor("red");

  // Create cache column
  var title = dataSheet.getRange(CACHE_VAL_COL + '1');
  title.setValue('CACHE');
  title.setBackground(RED);
  title.setFontColor(WHITE);
  title.setFontWeight('bold');

  var col = dataSheet.getRange(2, columnToIndex(CACHE_VAL_COL), dataSheet.getMaxRows() - 1);
  col.setFontColor(RED);
  col.setFontStyle('italic');

  // Create time column
  title = dataSheet.getRange(CACHE_TIME_COL + '1');
  title.setValue('TIME');
  title.setBackground(GREEN);
  title.setFontColor(WHITE);
  title.setFontWeight('bold');

  col = dataSheet.getRange(2, columnToIndex(CACHE_TIME_COL), dataSheet.getMaxRows() - 1);
  col.setFontColor(GREEN);

  // Create id column
  title = dataSheet.getRange(CACHE_ID_COL + '1');
  title.setValue('ID');
  title.setBackground(BLUE);
  title.setFontColor(WHITE);
  title.setFontWeight('bold');

  col = dataSheet.getRange(2, columnToIndex(CACHE_ID_COL), dataSheet.getMaxRows() - 1);
  col.setFontColor(BLUE);

  // Create history table
  // Create INDEX column
  title = dataSheet.getRange('A1');
  title.setValue('ID');
  title.setBackground(BLUE);
  title.setFontColor(WHITE);
  title.setFontWeight('bold');

  col = dataSheet.getRange(2, 1, dataSheet.getMaxRows() - 1);
  col.setFontColor(BLUE);

  // Create SET TIME column
  title = dataSheet.getRange('B1');
  title.setValue('SET TIME');
  title.setBackground(GREEN);
  title.setFontColor(WHITE);
  title.setFontWeight('bold');

  col = dataSheet.getRange(2, 2, dataSheet.getMaxRows() - 1);
  col.setFontColor(GREEN);

  // Create MESSAGE column
  title = dataSheet.getRange('C1');
  title.setValue('CACHE');
  title.setBackground(RED);
  title.setFontColor(WHITE);
  title.setFontWeight('bold');

  col = dataSheet.getRange(2, 3, dataSheet.getMaxRows() - 1);
  col.setFontColor(RED);

  // Create SENT TIME column
  title = dataSheet.getRange('D1');
  title.setValue('SENT TIME');
  title.setBackground(GREEN);
  title.setFontColor(WHITE);
  title.setFontWeight('bold');

  col = dataSheet.getRange(2, 4, dataSheet.getMaxRows() - 1);
  col.setFontColor(GREEN);
}

function checkSheetExists(sheetName) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  var sheet = spreadsheet.getSheetByName(sheetName);
  if (sheet !== null) {
    return true; // Sheet does not exist
  } else {
    return false; // Sheet exists
  }
}

function appendCache(trigger_id, time, value) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var cacheLast = sheet.getRange(CACHE_VAL_COL + '1:' + CACHE_VAL_COL).getValues().filter(String).length;
  var newIdCell = sheet.getRange(CACHE_ID_COL + (cacheLast + 1).toString());
  var newTimeCell = sheet.getRange(CACHE_TIME_COL + (cacheLast + 1).toString());
  var newCacheCell = sheet.getRange(CACHE_VAL_COL + (cacheLast + 1).toString());

  newIdCell.setValue(trigger_id);
  newTimeCell.setValue(time);
  newCacheCell.setValue(value);

  sortCacheByTime();
}

function readCache() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var lastRow = sheet.getRange(CACHE_VAL_COL + '1:' + CACHE_VAL_COL).getValues().filter(String).length.toString();
  var id_cell = CACHE_ID_COL + lastRow;
  var time_cell = CACHE_TIME_COL + lastRow;
  var cache_cell = CACHE_VAL_COL + lastRow;
  var id = sheet.getRange(id_cell).getValue().toString();
  var time = sheet.getRange(time_cell).getValue().toString();
  var cache = sheet.getRange(cache_cell).getValue().toString();

  // delete cache
  sheet.getRange(id_cell).clearContent();
  sheet.getRange(time_cell).clearContent();
  sheet.getRange(cache_cell).clearContent();

  return [id, time, cache];
}

function sortCacheByTime() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var caches = {};
  var ids = sheet.getRange(CACHE_ID_COL + '2:' + CACHE_ID_COL).getValues().filter(String);
  var dates = sheet.getRange(CACHE_TIME_COL + '2:' + CACHE_TIME_COL).getValues().filter(String);
  var value = sheet.getRange(CACHE_VAL_COL + '2:' + CACHE_VAL_COL).getValues().filter(String);

  for (var i = 0; i < dates.length; i++) {
    caches[dates[i]] = {
      id: ids[i],
      value: value[i]
    };
  }

  // sort caches by date
  var entries = Object.entries(caches);
  entries.sort(function(a, b) {
    return new Date(b[0]) - new Date(a[0]);
  });

  // convert sorted array back into a dictionary and save into sheet
  caches = {};
  row = 2;
  for (var i = 0; i < entries.length; i++) {
    caches[entries[i][0]] = entries[i][1];

    sheet.getRange(CACHE_ID_COL + (row + i)).setValue(entries[i][1].id);
    sheet.getRange(CACHE_TIME_COL + (row + i)).setValue(entries[i][0]);
    sheet.getRange(CACHE_VAL_COL + (row + i)).setValue(entries[i][1].value);
  }
  
  return caches;
}

function logReminder(time, text, send_time) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var lastLog = sheet.getRange('A1:A').getValues().filter(String).length;

  var newLogIndex = lastLog + 1;
  sheet.getRange('A' + newLogIndex).setValue(lastLog);
  sheet.getRange('B' + newLogIndex).setValue(time);
  sheet.getRange('C' + newLogIndex).setValue(text);
  sheet.getRange('D' + newLogIndex).setValue(send_time);
}

function columnToIndex(columnLabel) {
  var index = 0;
  var columnLabelUpper = columnLabel.toUpperCase();
  for (var i = 0; i < columnLabelUpper.length; i++) {
    var charCode = columnLabelUpper.charCodeAt(i);
    index = index * 26 + charCode - 64;
  }
  return index;
}

// Webhooks

const doPost = (request) => {
  const contents = JSON.parse(request.postData.contents);
  
  breakDownMessage(contents);
}

// Commands

const help = (input = null) => {
  var content = '';
  if (input === null) {
    content = content + COMMANDS.HELP.full_des + '\n';
    for (var key in COMMANDS) {
      var showDes = COMMANDS[key].description;
      if (showDes.length > MAX_DESCRIPTION_LEN) showDes = showDes.slice(0, MAX_DESCRIPTION_LEN);

      content = content + (COMMANDS[key].command.toUpperCase() + ': ').padStart(8) + showDes.padEnd(MAX_DESCRIPTION_LEN) + '\n';
    }
  }
  else {
    for (var key in COMMANDS) {
      var command = COMMANDS[key];
      if (command.command.toLowerCase() === input) {
        content = content + command.syntax + '\n' + '      ' + command.param_des + '\n\n';
        content = content + command.full_des;
      }
    }
  }

  sendMessage(monoText(content));
}

function setReminder(date, msg) {
  // Define the function you want to be triggered
  var functionName = 'sendReminder';

  // Set the date and time for the reminder
  // date = '2024-04-19T08:00:00'; // Change this to your desired date and time
  var reminderDate = new Date(date);
  if (reminderDate.toString() === 'Invalid Date') return sendError(monoText('Invalid date!'));
  var now = new Date();
  if (reminderDate < new Date(now.getTime() + 60000)) return sendError(monoText('The scheduled time must be at least 1 minute later from now!'));

  // Create the trigger to run the function at the specified date and time
  var trigger = ScriptApp.newTrigger(functionName)
      .timeBased()
      .at(reminderDate)
      .create();

  appendCache(trigger.getUniqueId(), reminderDate, msg);
  sendMessage(monoText('Reminder set for: ' + reminderDate), DEFAULT_CHAT_ID);
}

function sendReminder() {
  // Your reminder code here
  sendMessage(monoText('Reminder: '), DEFAULT_CHAT_ID);
  var cache = readCache();
  var id = cache[0];
  var time = cache[1];
  var message = cache[2];
  sendMessage(message, DEFAULT_CHAT_ID);

  // log reminder
  logReminder(time, message, new Date());

  // Delete the trigger after it has executed
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getUniqueId() === id) {
      ScriptApp.deleteTrigger(triggers[i]);
      Logger.log('Reminder trigger deleted.');
      break;
    }
  }
}

// MAIN

function breakDownMessage(contents)
{
  if (checkSheetExists(SHEET_NAME) === false) {
    createDataSheet();
  }

  const message = contents.message;
  const text = message.text;
  const send_id = message?.chat?.id;
  const parts = text.split(' ');
  var command = '';

  if (text === `/start`) return sendMessage(monoText('Welcome! This is your reminder. Type HELP to see available commands!'), send_id);
  if (parts === null || parts.length === 0) return sendError(monoText('Error: Syntax error!'), send_id);
  command = parts[0].toLowerCase();

  if (checkCommandExist(command) === false) return sendWarning(monoText('Command not found!'), send_id);

  if (command === COMMANDS.HELP.command)
  {
    if (parts.length < 2) return help();
    return help(text.slice(command.length + 1).toLowerCase());
  }
  if (command === COMMANDS.SET_REMINDER.command)
  {
    if (parts.length < 3) return sendError(monoText('Error: Syntax error!'), send_id);
    return setReminder(parts[1], text.slice(parts[0].length + parts[1].length + 2));
  }
}

function checkCommandExist(cmd) {
  for (var key in COMMANDS)
  {
    if (COMMANDS.hasOwnProperty(key)) {
      if (COMMANDS[key].command === cmd) return true;
    }
  }

  return false;
}
