# Quick Setup Guide - Service Request System

## 🚀 Fast Track Setup (5 Minutes)

### Step 1: Create Google Sheet (2 minutes)

**Option A: Import CSV Template**
1. Go to [Google Sheets](https://sheets.google.com)
2. Click **File** → **Import** → **Upload**
3. Upload `service_requests_template.csv` from your project folder
4. The sheet will be created with all columns ready!

**Option B: Manual Creation**
1. Go to [sheets.new](https://sheets.new) - creates a new sheet instantly
2. Name it: **KNUST VoIP Service Requests**
3. Copy this entire row and paste into Row 1:
   ```
   request_id	email	full_name	phone	department	service_category	urgency	quantity	budget_code	preferred_date	description	status	admin_response	admin_notes	estimated_cost	approval_date	completion_date	created_at	updated_at	email_confirmation_sent	email_status_update_sent
   ```
4. Format Row 1: Bold, background color, freeze row (View → Freeze → 1 row)

### Step 2: Get SheetDB API URL (1 minute)

1. Copy your Google Sheet URL
2. Go to [sheetdb.io](https://sheetdb.io)
3. Click **"Create Database"** (free account)
4. Paste your sheet URL
5. Click **"Create"**
6. **Copy the API URL** - looks like: `https://sheetdb.io/api/v1/abc123xyz`

### Step 3: Update service-requests.html (30 seconds)

Open `service-requests.html` and find line ~363:
```javascript
const SHEETDB_API_URL_REQUESTS = 'https://sheetdb.io/api/v1/YOUR_SHEETDB_ID';
```

Replace with your actual SheetDB URL:
```javascript
const SHEETDB_API_URL_REQUESTS = 'https://sheetdb.io/api/v1/abc123xyz'; // Your actual URL
```

Save the file.

### Step 4: Set Up Email Notifications (1 minute)

1. Open your **Service Requests** Google Sheet
2. Click **Extensions** → **Apps Script**
3. Delete any existing code
4. Copy ALL code from `google_apps_script_service_requests.gs`
5. Paste into Apps Script editor
6. **Update line 28** with your admin email:
   ```javascript
   ADMIN_EMAIL: "voip@knust.edu.gh", // Change to your email
   ```
7. Click **Save** (disk icon)
8. Click **Run** → Select `setupServiceRequests`
9. Click **Review Permissions** → **Allow**

### Step 5: Test! (30 seconds)

1. Open `service-requests.html` in your browser
2. Fill out the form with test data
3. Submit
4. Check:
   - ✅ Request appears in Google Sheet
   - ✅ You received admin email
   - ✅ Test user received confirmation email
   - ✅ Status checker works with Request ID

---

## 📋 Quick Reference

### SheetDB URL Location
**File**: `service-requests.html`  
**Line**: ~363  
**Variable**: `SHEETDB_API_URL_REQUESTS`

### Admin Email Location
**File**: `google_apps_script_service_requests.gs`  
**Line**: 28  
**Variable**: `ADMIN_EMAIL`

### Status Values
Use these in the `status` column:
- `Submitted` - Initial
- `Under Review` - Being evaluated
- `Approved` - Approved
- `In Progress` - Being implemented
- `Completed` - Done
- `Rejected` - Not approved

---

## 🔧 Troubleshooting

### Request not appearing in sheet?
- Check SheetDB URL is correct in `service-requests.html`
- Verify column names match exactly (all lowercase, underscores)
- Check browser console for errors (F12)

### Emails not sending?
- Run `setupServiceRequests()` in Apps Script
- Check ADMIN_EMAIL is set correctly
- Run `sendTestServiceRequestEmail()` to test

### Status checker not working?
- Verify SheetDB URL is correct
- Check request_id format (SR####)
- Try searching by email instead

---

## 📊 Sample Data for Testing

Use this to test your first request:

- **Email**: test@knust.edu.gh
- **Name**: Test User
- **Phone**: 0501234567
- **Department**: IT Services
- **Service**: WhatsApp Business Integration
- **Urgency**: High
- **Quantity**: 1
- **Description**: Need WhatsApp integration for student support

---

## ✅ Checklist

- [ ] Google Sheet created with 21 columns
- [ ] SheetDB account created
- [ ] SheetDB API URL copied
- [ ] `service-requests.html` updated with SheetDB URL
- [ ] Google Apps Script installed
- [ ] Admin email configured in script
- [ ] `setupServiceRequests()` function run
- [ ] Test request submitted successfully
- [ ] Admin email received
- [ ] User confirmation email received
- [ ] Status checker tested
- [ ] Committed changes to GitHub

---

## 🎯 You're Done!

Once all checkboxes are complete, your service request system is live and ready for production use!

**Live URL**: https://felly7.github.io/knust-voip/service-requests.html
