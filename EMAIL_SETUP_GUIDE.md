# Email Notification Setup Guide

## Quick Start

### Step 1: Add New Columns to Google Sheet

Add these two columns to your Google Sheet (after the `admin_response` column):

| Column | Header Name | Purpose |
|--------|-------------|---------|
| K | `email_confirmation_sent` | Tracks when creation email was sent |
| L | `email_response_sent` | Tracks when response email was sent |

### Step 2: Install the Script

1. Open your [Google Sheet](https://docs.google.com/spreadsheets/d/1x_9x9HWt5sjmS9Be10GXq64hLCI7nwXoULeXQlG9i9w/edit)
2. Click **Extensions** → **Apps Script**
3. Delete any existing code in the editor
4. Copy the entire contents of `google_apps_script_email_notifications.gs`
5. Paste it into the Apps Script editor
6. Click the **Save** icon (💾)
7. Name your project: "KNUST VoIP Email Notifications"

### Step 3: Run Setup

1. In the Apps Script editor, select the `setup` function from the dropdown
2. Click **Run** (▶️ button)
3. You'll be asked to authorize the script:
   - Click **Review Permissions**
   - Choose your Google account
   - Click **Advanced** → **Go to KNUST VoIP Email Notifications (unsafe)**
   - Click **Allow**
4. Check the **Execution log** - you should see "✅ Setup complete!"

### Step 4: Test the System

#### Test 1: Send Test Email
1. In Apps Script, select `sendTestEmail` function
2. Click **Run**
3. Check your email inbox for the test message

#### Test 2: Test Confirmation Email
1. Go to your Google Sheet
2. Click on any ticket row (not the header)
3. In Apps Script, select `sendConfirmationEmailForSelectedRow`
4. Click **Run**
5. Check the email address in that row's inbox

#### Test 3: Test Admin Response Email
1. In your Google Sheet, add a message to the `admin_response` column for any ticket
2. Press Enter to save
3. The email should be sent automatically within a few seconds
4. Check the ticket owner's email inbox

## Configuration

Edit these settings in the script if needed:

```javascript
EMAIL_FROM_NAME: "KNUST VoIP Support"  // Change sender name
STATUS_CHECK_URL: "https://voip.knust.edu.gh/report-issue.html"  // Your website URL
SUPPORT_EMAIL: "voip@knust.edu.gh"  // Your support email for replies
```

## How It Works

### Automatic Triggers

The script automatically sends emails when:

1. **New ticket is created**: When SheetDB adds a new row with a `ticket_id`, the user receives a confirmation email automatically (within 2-3 seconds)
2. **Admin adds a response**: When you type in the `admin_response` column and press Enter, the user receives an email notification

### Two Methods for New Ticket Emails

**Method 1: Instant (Recommended)**
- Triggers when the `ticket_id` column is filled
- Sends email within 2-3 seconds
- Works automatically with SheetDB

**Method 2: Periodic Check (Backup)**
- Optional time-based trigger that runs every 5 minutes
- Checks for any tickets that don't have confirmation emails sent
- Good as a safety net
- To enable: Uncomment the time-based trigger code in the `setup()` function

### Email Templates

#### Ticket Creation Email
- **Subject**: "Ticket #{ticket_id} Created - KNUST VoIP Support"
- **Content**: 
  - Ticket ID (highlighted in orange)
  - Topic
  - Status
  - Link to check status page
  - Support contact info

#### Admin Response Email
- **Subject**: "Update on Ticket #{ticket_id} - KNUST VoIP Support"
- **Content**:
  - Ticket details
  - Admin's response (in highlighted box)
  - Link to check status page
  - Reply-to address set to support email

## Troubleshooting

### Emails Not Sending

1. **Check Execution Log**: In Apps Script, go to **View** → **Executions** to see if there are errors
2. **Verify Triggers**: Go to **Triggers** (clock icon) and ensure the `onSheetEdit` trigger exists
3. **Check Email Addresses**: Make sure the `email` column has valid email addresses
4. **Check Sent Columns**: If `email_confirmation_sent` or `email_response_sent` has a date, the email was already sent

### Re-send an Email

To re-send an email:
1. Clear the timestamp in the `email_confirmation_sent` or `email_response_sent` column
2. For confirmation: Run `sendConfirmationEmailForSelectedRow` with the row selected
3. For response: Edit the `admin_response` cell again (add a space and remove it)

### Daily Email Limit

Google Apps Script has a daily email quota:
- **Free Gmail accounts**: 100 emails/day
- **Google Workspace accounts**: 1,500 emails/day

## Advanced: Sending Confirmation Emails for New Tickets

Currently, confirmation emails must be sent manually. To automate this:

### Option 1: Manual Batch Send
Run this function periodically to send confirmations for all unsent tickets:

```javascript
function sendPendingConfirmations() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) { // Skip header
    const row = i + 1;
    const emailSent = data[i][CONFIG.COLUMNS.EMAIL_CONFIRMATION_SENT];
    
    if (!emailSent) {
      sendTicketConfirmationEmail(sheet, row);
      Utilities.sleep(1000); // Wait 1 second between emails
    }
  }
}
```

### Option 2: Time-Based Trigger
Set up a trigger to run every 5 minutes and check for new tickets.

## Support

If you encounter issues:
1. Check the **Execution log** in Apps Script
2. Verify all column headers match exactly
3. Ensure the script has proper permissions
4. Test with `sendTestEmail()` function
