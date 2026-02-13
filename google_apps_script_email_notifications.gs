/**
 * KNUST VoIP Ticket System - Email Notification Script
 * 
 * This script automatically sends email notifications for:
 * 1. Ticket creation confirmation
 * 2. Admin response notifications
 * 
 * Setup Instructions:
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Delete any existing code and paste this entire script
 * 4. Click Save (disk icon)
 * 5. Run 'setup' function once to create triggers
 * 6. Authorize the script when prompted
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
  // Column indices (0-based)
  COLUMNS: {
    TICKET_ID: 0,        // Column A
    EMAIL: 1,            // Column B
    FULL_NAME: 2,        // Column C
    PHONE: 3,            // Column D
    EXTENSION: 4,        // Column E
    TOPIC: 5,            // Column F
    OTHER_TOPIC: 6,      // Column G
    STATUS: 7,           // Column H
    CREATED_AT: 8,       // Column I
    ADMIN_RESPONSE: 9,   // Column J
    EMAIL_CONFIRMATION_SENT: 10,  // Column K (NEW)
    EMAIL_RESPONSE_SENT: 11,      // Column L (NEW)
  },
  
  // Email settings
  EMAIL_FROM_NAME: "KNUST VoIP Support",
  STATUS_CHECK_URL: "https://voip.knust.edu.gh/report-issue.html",
  SUPPORT_EMAIL: "voip@knust.edu.gh", // Change this to your support email
};

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Run this function ONCE to set up automatic triggers
 */
function setup() {
  // Delete existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // Create new trigger for when sheet is edited
  ScriptApp.newTrigger('onSheetEdit')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();
  
  // OPTIONAL: Create time-based trigger to check for new tickets every 5 minutes
  // Uncomment the lines below if you want periodic checking as a backup
  /*
  ScriptApp.newTrigger('checkForNewTickets')
    .timeBased()
    .everyMinutes(5)
    .create();
  */
  
  Logger.log('✅ Setup complete! Triggers created.');
  Logger.log('The script will now automatically send emails when:');
  Logger.log('1. A new ticket is added (ticket_id is filled)');
  Logger.log('2. An admin response is added');
}

/**
 * Triggered automatically when the sheet is edited
 */
function onSheetEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    const range = e.range;
    const row = range.getRow();
    
    // Skip header row
    if (row === 1) return;
    
    const editedColumn = range.getColumn() - 1; // Convert to 0-based
    
    // Check if this is a new ticket (ticket_id column was just filled)
    if (editedColumn === CONFIG.COLUMNS.TICKET_ID) {
      // Small delay to ensure all data is entered
      Utilities.sleep(2000);
      sendTicketConfirmationEmail(sheet, row);
    }
    
    // Check if admin_response column was edited
    if (editedColumn === CONFIG.COLUMNS.ADMIN_RESPONSE) {
      sendAdminResponseEmail(sheet, row);
    }
  } catch (error) {
    Logger.log('Error in onSheetEdit: ' + error.message);
  }
}

/**
 * Alternative: Use this if you want to check for new rows periodically
 * Set up a time-based trigger to run this every 5 minutes
 */
function checkForNewTickets() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const lastRow = sheet.getLastRow();
    
    // Start from row 2 (skip header)
    for (let row = 2; row <= lastRow; row++) {
      const emailSent = sheet.getRange(row, CONFIG.COLUMNS.EMAIL_CONFIRMATION_SENT + 1).getValue();
      const ticketId = sheet.getRange(row, CONFIG.COLUMNS.TICKET_ID + 1).getValue();
      
      // If ticket exists but no confirmation email sent
      if (ticketId && !emailSent) {
        sendTicketConfirmationEmail(sheet, row);
        Utilities.sleep(1000); // Wait 1 second between emails
      }
    }
    
    Logger.log('✅ Checked for new tickets');
  } catch (error) {
    Logger.log('❌ Error checking for new tickets: ' + error.message);
  }
}

/**
 * Manually send confirmation email for a specific row
 * Usage: Select the row and run this function
 */
function sendConfirmationEmailForSelectedRow() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const row = sheet.getActiveRange().getRow();
  
  if (row === 1) {
    SpreadsheetApp.getUi().alert('Please select a ticket row (not the header)');
    return;
  }
  
  sendTicketConfirmationEmail(sheet, row);
}

/**
 * Send confirmation email when ticket is created
 */
function sendTicketConfirmationEmail(sheet, row) {
  try {
    const rowData = sheet.getRange(row, 1, 1, CONFIG.COLUMNS.EMAIL_CONFIRMATION_SENT + 1).getValues()[0];
    
    const ticketId = rowData[CONFIG.COLUMNS.TICKET_ID];
    const email = rowData[CONFIG.COLUMNS.EMAIL];
    const fullName = rowData[CONFIG.COLUMNS.FULL_NAME];
    const topic = rowData[CONFIG.COLUMNS.TOPIC];
    const otherTopic = rowData[CONFIG.COLUMNS.OTHER_TOPIC];
    const emailSent = rowData[CONFIG.COLUMNS.EMAIL_CONFIRMATION_SENT];
    
    // Skip if email already sent
    if (emailSent) {
      Logger.log(`Confirmation email already sent for ticket ${ticketId}`);
      return;
    }
    
    // Skip if no email address
    if (!email) {
      Logger.log(`No email address for ticket ${ticketId}`);
      return;
    }
    
    const displayTopic = topic === 'other' ? otherTopic : topic;
    
    const subject = `Ticket #${ticketId} Created - KNUST VoIP Support`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0d063b; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">KNUST VoIP Support</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #0d063b;">Ticket Created Successfully</h2>
          
          <p>Dear ${fullName},</p>
          
          <p>Thank you for contacting KNUST VoIP Support. Your ticket has been created and our team will review it shortly.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Ticket ID:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #ff6600; font-weight: bold;">${ticketId}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Topic:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${displayTopic}</td>
              </tr>
              <tr>
                <td style="padding: 10px;"><strong>Status:</strong></td>
                <td style="padding: 10px;"><span style="background: #fef9c3; color: #854d0e; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">PENDING</span></td>
              </tr>
            </table>
          </div>
          
          <p><strong>Please keep your Ticket ID (${ticketId}) for your records.</strong></p>
          
          <p>You can check the status of your ticket at any time:</p>
          <p style="text-align: center;">
            <a href="${CONFIG.STATUS_CHECK_URL}" style="background: #ff6600; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Check Ticket Status</a>
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you have any urgent concerns, please contact us at ${CONFIG.SUPPORT_EMAIL}
          </p>
        </div>
        
        <div style="background: #e2e8f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>KNUST VoIP Support | University IT Services</p>
        </div>
      </div>
    `;
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody,
      name: CONFIG.EMAIL_FROM_NAME
    });
    
    // Mark as sent
    sheet.getRange(row, CONFIG.COLUMNS.EMAIL_CONFIRMATION_SENT + 1).setValue(new Date());
    
    Logger.log(`✅ Confirmation email sent to ${email} for ticket ${ticketId}`);
    
  } catch (error) {
    Logger.log(`❌ Error sending confirmation email: ${error.message}`);
  }
}

/**
 * Send notification email when admin responds
 */
function sendAdminResponseEmail(sheet, row) {
  try {
    const rowData = sheet.getRange(row, 1, 1, CONFIG.COLUMNS.EMAIL_RESPONSE_SENT + 1).getValues()[0];
    
    const ticketId = rowData[CONFIG.COLUMNS.TICKET_ID];
    const email = rowData[CONFIG.COLUMNS.EMAIL];
    const fullName = rowData[CONFIG.COLUMNS.FULL_NAME];
    const topic = rowData[CONFIG.COLUMNS.TOPIC];
    const otherTopic = rowData[CONFIG.COLUMNS.OTHER_TOPIC];
    const status = rowData[CONFIG.COLUMNS.STATUS];
    const adminResponse = rowData[CONFIG.COLUMNS.ADMIN_RESPONSE];
    const responseSent = rowData[CONFIG.COLUMNS.EMAIL_RESPONSE_SENT];
    
    // Skip if no response or already sent
    if (!adminResponse || adminResponse.trim() === '') {
      return;
    }
    
    if (responseSent) {
      Logger.log(`Response email already sent for ticket ${ticketId}`);
      return;
    }
    
    if (!email) {
      Logger.log(`No email address for ticket ${ticketId}`);
      return;
    }
    
    const displayTopic = topic === 'other' ? otherTopic : topic;
    
    const subject = `Update on Ticket #${ticketId} - KNUST VoIP Support`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0d063b; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">KNUST VoIP Support</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #0d063b;">Update on Your Ticket</h2>
          
          <p>Dear ${fullName},</p>
          
          <p>Our support team has responded to your ticket.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Ticket ID:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #ff6600; font-weight: bold;">${ticketId}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Topic:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${displayTopic}</td>
              </tr>
              <tr>
                <td style="padding: 10px;"><strong>Status:</strong></td>
                <td style="padding: 10px;">${status}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #fff8f0; border-left: 4px solid #ff6600; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #0d063b;">Help Desk Response:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${adminResponse}</p>
          </div>
          
          <p>You can check your ticket status and view the full conversation at any time:</p>
          <p style="text-align: center;">
            <a href="${CONFIG.STATUS_CHECK_URL}" style="background: #ff6600; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Check Ticket Status</a>
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you need further assistance, please reply to this email or contact us at ${CONFIG.SUPPORT_EMAIL}
          </p>
        </div>
        
        <div style="background: #e2e8f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>KNUST VoIP Support | University IT Services</p>
        </div>
      </div>
    `;
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody,
      name: CONFIG.EMAIL_FROM_NAME,
      replyTo: CONFIG.SUPPORT_EMAIL
    });
    
    // Mark as sent
    sheet.getRange(row, CONFIG.COLUMNS.EMAIL_RESPONSE_SENT + 1).setValue(new Date());
    
    Logger.log(`✅ Response email sent to ${email} for ticket ${ticketId}`);
    
  } catch (error) {
    Logger.log(`❌ Error sending response email: ${error.message}`);
  }
}

/**
 * Test function - sends a test email to verify setup
 */
function sendTestEmail() {
  const testEmail = Session.getActiveUser().getEmail();
  
  MailApp.sendEmail({
    to: testEmail,
    subject: "Test Email - KNUST VoIP Notification System",
    htmlBody: "<h1>Success!</h1><p>Your email notification system is working correctly.</p>",
    name: CONFIG.EMAIL_FROM_NAME
  });
  
  Logger.log(`Test email sent to ${testEmail}`);
  SpreadsheetApp.getUi().alert(`Test email sent to ${testEmail}`);
}
