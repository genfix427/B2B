import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send verification email to user
const sendVerificationEmail = async (user) => {
  const mailOptions = {
    from: `"MatchRX" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: 'Registration Submitted Successfully',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4CAF50;">Registration Submitted Successfully!</h2>
        <p>Dear ${user.legalBusinessName},</p>
        <p>Thank you for completing your registration with MatchRX. Your application has been submitted successfully and is now pending admin verification.</p>
        <p>Our team will review your documents and information. You will receive an email notification once your account has been verified.</p>
        <p><strong>Application Details:</strong></p>
        <ul>
          <li><strong>Business Name:</strong> ${user.legalBusinessName}</li>
          <li><strong>NPI #:</strong> ${user.npiNumber}</li>
          <li><strong>Status:</strong> Pending Verification</li>
        </ul>
        <p>This process typically takes 1-2 business days. If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>The MatchRX Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send notification to admin
const sendAdminNotification = async (user) => {
  const mailOptions = {
    from: `"MatchRX System" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: 'New Vendor Registration Pending Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2196F3;">New Vendor Registration</h2>
        <p>A new vendor has completed registration and is pending verification.</p>
        <p><strong>Vendor Details:</strong></p>
        <ul>
          <li><strong>Business Name:</strong> ${user.legalBusinessName}</li>
          <li><strong>DBA:</strong> ${user.doingBusinessAs}</li>
          <li><strong>NPI #:</strong> ${user.npiNumber}</li>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Phone:</strong> ${user.phone}</li>
          <li><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</li>
        </ul>
        <p>Please log in to the admin dashboard to review and verify this vendor.</p>
        <p><a href="${process.env.FRONTEND_URL}/admin/vendors" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Admin Dashboard</a></p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send verification result email
const sendVerificationResultEmail = async (user, status, notes = '') => {
  const statusColors = {
    approved: '#4CAF50',
    rejected: '#f44336'
  };

  const statusMessages = {
    approved: `
      <p>Congratulations! Your vendor account has been <strong style="color: ${statusColors.approved}">APPROVED</strong>.</p>
      <p>You can now log in to your dashboard and start using all features of MatchRX.</p>
      <p><a href="${process.env.FRONTEND_URL}/login" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Login to Dashboard</a></p>
    `,
    rejected: `
      <p>We regret to inform you that your vendor account has been <strong style="color: ${statusColors.rejected}">REJECTED</strong>.</p>
      ${notes ? `<p><strong>Reason:</strong> ${notes}</p>` : ''}
      <p>Please review your submitted documents and information. You may need to update your application and resubmit for verification.</p>
    `
  };

  const mailOptions = {
    from: `"MatchRX" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: `Account Verification ${status.toUpperCase()}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${statusColors[status]};">Account Verification ${status.toUpperCase()}</h2>
        <p>Dear ${user.legalBusinessName},</p>
        ${statusMessages[status]}
        ${notes ? `<p><strong>Admin Notes:</strong> ${notes}</p>` : ''}
        <p>If you have any questions, please contact our support team.</p>
        <p>Best regards,<br>The MatchRX Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export { sendVerificationEmail, sendAdminNotification, sendVerificationResultEmail };