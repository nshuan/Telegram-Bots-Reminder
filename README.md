# Telegram-Bots-Reminder

This project contains a Telegram bot for schedule message in telegram. It utilizes Google Apps Script to handle bot interactions and Google Sheets as a backend to store data.

## Constants Description
Replace these field with your information.

### `TOKEN`
- Description: Your telegram Bot API token.
- Usage: This token is used to authenticate requests to the Telegram Bot API.

### `BASE_URL`
- Description: Base URL for Telegram Bot API requests.
- Usage: This URL is used to construct API endpoints for sending requests to the Telegram Bot API.
  
### `DEFAULT_CHAT_ID`
- Description: Default chat ID of the user or group where the bot sends messages when it can not get the chat id of the message sender.

### `DEPLOYED_URL`
- Description: URL of the deployed Google Apps Script web app.
- Usage: This URL is used as an endpoint for receiving incoming messages and processing bot commands.

### `SHEET_NAME`
- Description: Name of the Google Sheets sheet for database simulation. The first row in this sheet should always be the title.

### `CACHE_ID_COL`
- Description: Column letter of the id of the trigger associating with the message cache.

### `CACHE_TIME_COL`
- Description: Column letter of the timeto execute the trigger associating with the message cache.

### `CACHE_VAL_COL`
- Description: Column letter of the message cache.

## Usage
To use this Telegram Expense Tracker Bot:

1. (Optional) Set up a Google Sheets spreadsheet to store data. Sample sheet as the image in sheet-preview.png. If the sheet is doesn't exist when the bot is called, it will automatically generate a new sheet.
2. Replace the constants in the code with your own values.
3. Deploy the Google Apps Script web app using the provided code.
   - Replace TOKEN with your bot token.
   - Replace `DEFAULT_CHAT_ID` with your desired default chat ID. You can get the chat ID where messages are sent by using `getChatId()` function. Remember to `deleteWebhook()` first.
   - Deploy.
   - Get the deploy url in the popup. Replace `DEPLOYED_URL` with your received url.
   - Run `setWebhook()`.
4. Interact with the bot in your Telegram chat to set reminders.

