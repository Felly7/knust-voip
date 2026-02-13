/**
 * KNUST VoIP Service Request System - Email Notification Script
 * 
 * This script automatically sends email notifications for service requests:
 * 1. Admin notification when new request is submitted
 * 2. User confirmation email
 * 3. Status update notifications
 * 
 * Setup Instructions:
 * 1. Open your Service Requests Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste this code
 * 4. Update CONFIG section with your details
 * 5. Run 'setupServiceRequests' function once
 */

// ============================================
// CONFIGURATION
// ============================================

const SERVICE_REQUEST_CONFIG = {
  // Column indices (0-based)
  COLUMNS: {
    REQUEST_ID: 0,        // Column A
    EMAIL: 1,             // Column B
    FULL_NAME: 2,         // Column C
    PHONE: 3,             // Column D
    DEPARTMENT: 4,        // Column E
    SERVICE_CATEGORY: 5,  // Column F
    URGENCY: 6,           // Column G
    QUANTITY: 7,          // Column H
    BUDGET_CODE: 8,       // Column I
    PREFERRED_DATE: 9,    // Column J
    DESCRIPTION: 10,      // Column K
    STATUS: 11,           // Column L
    ADMIN_RESPONSE: 12,   // Column M
    ADMIN_NOTES: 13,      // Column N
    ESTIMATED_COST: 14,   // Column O
    APPROVAL_DATE: 15,    // Column P
    COMPLETION_DATE: 16,  // Column Q
    CREATED_AT: 17,       // Column R
    UPDATED_AT: 18,       // Column S
    EMAIL_CONFIRMATION_SENT: 19,  // Column T
    EMAIL_STATUS_UPDATE_SENT: 20, // Column U
  },
  
  // Email settings
  EMAIL_FROM_NAME: "KNUST VoIP Services",
  ADMIN_EMAIL: "voip@knust.edu.gh", // Change this to your admin email
  STATUS_CHECK_URL: "https://felly7.github.io/knust-voip/service-requests.html",
};

// ============================================
// SETUP FUNCTION
// ============================================

/**
 * Run this function ONCE to set up automatic triggers
 */
function setupServiceRequests() {
  // Delete existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // Create new trigger for when sheet is edited
  ScriptApp.newTrigger('onServiceRequestEdit')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();
  
  Logger.log('✅ Setup complete! Service request email notifications are active.');
}

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Triggered automatically when the sheet is edited
 */
function onServiceRequestEdit(e) {
  try {
    const sheet = e.source.getActiveSheet();
    const range = e.range;
    const row = range.getRow();
    
    // Skip header row
    if (row === 1) return;
    
    const editedColumn = range.getColumn() - 1; // Convert to 0-based
    
    // Check if this is a new request (request_id column was just filled)
    if (editedColumn === SERVICE_REQUEST_CONFIG.COLUMNS.REQUEST_ID) {
      Utilities.sleep(2000); // Wait for all data to be entered
      sendRequestConfirmationEmail(sheet, row);
      sendAdminNotificationEmail(sheet, row);
    }
    
    // Check if status or admin_response was updated
    if (editedColumn === SERVICE_REQUEST_CONFIG.COLUMNS.STATUS || 
        editedColumn === SERVICE_REQUEST_CONFIG.COLUMNS.ADMIN_RESPONSE) {
      sendStatusUpdateEmail(sheet, row);
    }
  } catch (error) {
    Logger.log('Error in onServiceRequestEdit: ' + error.message);
  }
}

// ============================================
// EMAIL FUNCTIONS
// ============================================

/**
 * Send confirmation email to user when request is submitted
 */
function sendRequestConfirmationEmail(sheet, row) {
  try {
    const rowData = sheet.getRange(row, 1, 1, SERVICE_REQUEST_CONFIG.COLUMNS.EMAIL_CONFIRMATION_SENT + 1).getValues()[0];
    
    const requestId = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.REQUEST_ID];
    const email = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.EMAIL];
    const fullName = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.FULL_NAME];
    const serviceCategory = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.SERVICE_CATEGORY];
    const urgency = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.URGENCY];
    const emailSent = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.EMAIL_CONFIRMATION_SENT];
    
    // Skip if email already sent
    if (emailSent) {
      Logger.log(`Confirmation email already sent for request ${requestId}`);
      return;
    }
    
    if (!email) {
      Logger.log(`No email address for request ${requestId}`);
      return;
    }
    
    const categoryName = getCategoryDisplayName(serviceCategory);
    
    const subject = `Service Request #${requestId} Received - KNUST VoIP`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0d063b; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">KNUST VoIP Services</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #0d063b;">Service Request Received</h2>
          
          <p>Dear ${fullName},</p>
          
          <p>Thank you for your service request. We have received your request and our team will review it shortly.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Request ID:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #ff6600; font-weight: bold;">${requestId}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Service:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${categoryName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Urgency:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${urgency}</td>
              </tr>
              <tr>
                <td style="padding: 10px;"><strong>Status:</strong></td>
                <td style="padding: 10px;"><span style="background: #fef9c3; color: #854d0e; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">SUBMITTED</span></td>
              </tr>
            </table>
          </div>
          
          <p><strong>Please keep your Request ID (${requestId}) for your records.</strong></p>
          
          <p>You can check the status of your request at any time:</p>
          <p style="text-align: center;">
            <a href="${SERVICE_REQUEST_CONFIG.STATUS_CHECK_URL}" style="background: #ff6600; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Check Request Status</a>
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            We'll notify you via email when there are updates to your request.
          </p>
        </div>
        
        <div style="background: #e2e8f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>KNUST VoIP Services | University IT Services</p>
        </div>
      </div>
    `;
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody,
      name: SERVICE_REQUEST_CONFIG.EMAIL_FROM_NAME
    });
    
    // Mark as sent
    sheet.getRange(row, SERVICE_REQUEST_CONFIG.COLUMNS.EMAIL_CONFIRMATION_SENT + 1).setValue(new Date());
    
    Logger.log(`✅ Confirmation email sent to ${email} for request ${requestId}`);
    
  } catch (error) {
    Logger.log(`❌ Error sending confirmation email: ${error.message}`);
  }
}

/**
 * Send notification email to admin when new request is submitted
 */
function sendAdminNotificationEmail(sheet, row) {
  try {
    const rowData = sheet.getRange(row, 1, 1, SERVICE_REQUEST_CONFIG.COLUMNS.DESCRIPTION + 1).getValues()[0];
    
    const requestId = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.REQUEST_ID];
    const email = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.EMAIL];
    const fullName = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.FULL_NAME];
    const phone = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.PHONE];
    const department = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.DEPARTMENT];
    const serviceCategory = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.SERVICE_CATEGORY];
    const urgency = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.URGENCY];
    const quantity = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.QUANTITY];
    const description = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.DESCRIPTION];
    
    const categoryName = getCategoryDisplayName(serviceCategory);
    const urgencyColor = urgency === 'critical' ? '#dc2626' : urgency === 'high' ? '#ea580c' : urgency === 'medium' ? '#ca8a04' : '#65a30d';
    
    const subject = `🔔 New Service Request #${requestId} - ${categoryName}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🔔 New Service Request</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #0d063b;">Request #${requestId}</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${urgencyColor};">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Requester:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Email:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Phone:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Department:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${department}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Service:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${categoryName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Urgency:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><span style="color: ${urgencyColor}; font-weight: bold;">${urgency.toUpperCase()}</span></td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Quantity:</strong></td>
                <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${quantity}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #fff8f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0d063b;">Description:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${description}</p>
          </div>
          
          <p style="text-align: center;">
            <a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}" style="background: #0d063b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Open Google Sheet</a>
          </p>
        </div>
        
        <div style="background: #e2e8f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>KNUST VoIP Services | Admin Notification</p>
        </div>
      </div>
    `;
    
    MailApp.sendEmail({
      to: SERVICE_REQUEST_CONFIG.ADMIN_EMAIL,
      subject: subject,
      htmlBody: htmlBody,
      name: SERVICE_REQUEST_CONFIG.EMAIL_FROM_NAME
    });
    
    Logger.log(`✅ Admin notification sent for request ${requestId}`);
    
  } catch (error) {
    Logger.log(`❌ Error sending admin notification: ${error.message}`);
  }
}

/**
 * Send status update email to user
 */
function sendStatusUpdateEmail(sheet, row) {
  try {
    const rowData = sheet.getRange(row, 1, 1, SERVICE_REQUEST_CONFIG.COLUMNS.EMAIL_STATUS_UPDATE_SENT + 1).getValues()[0];
    
    const requestId = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.REQUEST_ID];
    const email = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.EMAIL];
    const fullName = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.FULL_NAME];
    const serviceCategory = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.SERVICE_CATEGORY];
    const status = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.STATUS];
    const adminResponse = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.ADMIN_RESPONSE];
    const estimatedCost = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.ESTIMATED_COST];
    const updateSent = rowData[SERVICE_REQUEST_CONFIG.COLUMNS.EMAIL_STATUS_UPDATE_SENT];
    
    // Skip if no significant update or already sent
    if (!adminResponse && !status) return;
    if (updateSent) {
      Logger.log(`Status update email already sent for request ${requestId}`);
      return;
    }
    
    if (!email) return;
    
    const categoryName = getCategoryDisplayName(serviceCategory);
    
    const subject = `Update on Service Request #${requestId} - KNUST VoIP`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0d063b; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">KNUST VoIP Services</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #0d063b;">Update on Your Service Request</h2>
          
          <p>Dear ${fullName},</p>
          
          <p>There's an update on your service request.</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Request ID:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #ff6600; font-weight: bold;">${requestId}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>Service:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${categoryName}</td>
              </tr>
              <tr>
                <td style="padding: 10px;"><strong>Status:</strong></td>
                <td style="padding: 10px;"><strong>${status}</strong></td>
              </tr>
              ${estimatedCost ? `<tr><td style="padding: 10px;"><strong>Estimated Cost:</strong></td><td style="padding: 10px;">${estimatedCost}</td></tr>` : ''}
            </table>
          </div>
          
          ${adminResponse ? `
          <div style="background: #fff8f0; border-left: 4px solid #ff6600; padding: 20px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0; color: #0d063b;">Response from VoIP Services:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${adminResponse}</p>
          </div>
          ` : ''}
          
          <p>You can check your request status and view full details at any time:</p>
          <p style="text-align: center;">
            <a href="${SERVICE_REQUEST_CONFIG.STATUS_CHECK_URL}" style="background: #ff6600; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Check Request Status</a>
          </p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you have any questions, please reply to this email.
          </p>
        </div>
        
        <div style="background: #e2e8f0; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>KNUST VoIP Services | University IT Services</p>
        </div>
      </div>
    `;
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody,
      name: SERVICE_REQUEST_CONFIG.EMAIL_FROM_NAME,
      replyTo: SERVICE_REQUEST_CONFIG.ADMIN_EMAIL
    });
    
    // Mark as sent
    sheet.getRange(row, SERVICE_REQUEST_CONFIG.COLUMNS.EMAIL_STATUS_UPDATE_SENT + 1).setValue(new Date());
    
    Logger.log(`✅ Status update email sent to ${email} for request ${requestId}`);
    
  } catch (error) {
    Logger.log(`❌ Error sending status update email: ${error.message}`);
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getCategoryDisplayName(value) {
  const categories = {
    'gsm_gateway': 'GSM/PSTN Gateway Devices',
    'ucm_server': 'Grandstream UCM Servers',
    'handsets': 'VoIP Handsets',
    'conference_equipment': 'Conference Room Equipment',
    'call_cards': 'External Call Cards',
    'ivr': 'IVR (Interactive Voice Response)',
    'call_recording': 'Call Recording',
    'analytics': 'Call Analytics & Reporting',
    'queue_management': 'Queue Management',
    'omnichannel': 'Omnichannel Contact Center',
    'whatsapp': 'WhatsApp Business Integration',
    'telegram': 'Telegram Integration',
    'sms_gateway': 'Bulk SMS Gateway',
    'email_integration': 'Email Integration',
    'social_media': 'Social Media Integration',
    'service_quote': 'Service Quotation',
    'hardware_quote': 'Hardware Quotation',
    'invoice': 'Invoice Request',
    'custom_quote': 'Custom Solution Quote',
    'training': 'Training Request',
    'consultation': 'Technical Consultation',
    'custom': 'Custom Request'
  };
  return categories[value] || value;
}

/**
 * Test function - sends a test email to verify setup
 */
function sendTestServiceRequestEmail() {
  const testEmail = Session.getActiveUser().getEmail();
  
  MailApp.sendEmail({
    to: testEmail,
    subject: "Test Email - Service Request Notification System",
    htmlBody: "<h1>Success!</h1><p>Your service request email notification system is working correctly.</p>",
    name: SERVICE_REQUEST_CONFIG.EMAIL_FROM_NAME
  });
  
  Logger.log(`Test email sent to ${testEmail}`);
  SpreadsheetApp.getUi().alert(`Test email sent to ${testEmail}`);
}
