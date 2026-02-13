# Service Request System - Google Sheet Setup

## Step 1: Create New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"KNUST VoIP Service Requests"**

## Step 2: Set Up Column Headers

In the first row (Row 1), add these column headers **exactly as shown** (all lowercase):

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| request_id | email | full_name | phone | department | service_category | urgency | quantity |

| I | J | K | L | M | N | O | P |
|---|---|---|---|---|---|---|---|
| budget_code | preferred_date | description | status | admin_response | admin_notes | estimated_cost | approval_date |

| Q | R | S | T |
|---|---|---|---|
| completion_date | created_at | updated_at | email_confirmation_sent |

| U |
|---|
| email_status_update_sent |

**Total: 21 columns (A through U)**

## Step 3: Set Up SheetDB

1. Go to [SheetDB.io](https://sheetdb.io)
2. Sign in or create a free account
3. Click **"Create Database"**
4. Paste your Google Sheet URL
5. Click **"Create"**
6. Copy the API URL (looks like: `https://sheetdb.io/api/v1/XXXXX`)

## Step 4: Update service-requests.html

1. Open `service-requests.html`
2. Find line with: `const SHEETDB_API_URL_REQUESTS = 'https://sheetdb.io/api/v1/YOUR_SHEETDB_ID';`
3. Replace `YOUR_SHEETDB_ID` with your actual SheetDB API URL
4. Save the file

## Step 5: Set Up Email Notifications

### Update Google Apps Script

1. Open your **Service Requests** Google Sheet
2. Go to **Extensions** → **Apps Script**
3. You'll need to add new functions to handle service request emails

I'll provide the updated Google Apps Script code separately that includes:
- Admin notification when new request is submitted
- User confirmation email
- Status update notifications

## Step 6: Test the System

1. Open `service-requests.html` in your browser
2. Fill out the form and submit a test request
3. Check that:
   - Request appears in Google Sheet
   - Request ID is generated (SR1234 format)
   - You can check status with the Request ID
   - Emails are sent (after setting up Apps Script)

## Column Descriptions

| Column | Purpose | Example |
|--------|---------|---------|
| `request_id` | Unique ID (SR1234) | SR5678 |
| `email` | User's email | user@knust.edu.gh |
| `full_name` | User's full name | John Doe |
| `phone` | Phone number | 0501234567 |
| `department` | Department/Unit | Engineering |
| `service_category` | Service type | whatsapp |
| `urgency` | Priority level | high |
| `quantity` | Number of items | 5 |
| `budget_code` | Budget reference | BUD-2024-001 |
| `preferred_date` | Implementation date | 2024-03-15 |
| `description` | Detailed request | Need WhatsApp integration... |
| `status` | Current status | Submitted, Approved, etc. |
| `admin_response` | Your response to user | We've approved your request... |
| `admin_notes` | Internal notes (not shown to user) | Contact vendor X |
| `estimated_cost` | Cost estimate | GHS 5,000 |
| `approval_date` | When approved | 2024-02-13 |
| `completion_date` | When completed | 2024-03-01 |
| `created_at` | Submission timestamp | Auto-filled |
| `updated_at` | Last update timestamp | Auto-filled |
| `email_confirmation_sent` | Email tracking | Auto-filled |
| `email_status_update_sent` | Email tracking | Auto-filled |

## Status Values

Use these status values in the `status` column:

- **Submitted** - Initial status
- **Under Review** - Being evaluated
- **Approved** - Request approved
- **In Progress** - Being implemented
- **Completed** - Finished
- **Rejected** - Not approved

## Next Steps

Once the sheet is set up and SheetDB is configured:
1. Test request submission
2. Set up email notifications (Apps Script)
3. Train staff on using the system
4. Monitor requests and respond via the sheet
