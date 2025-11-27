const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    const { to, code } = JSON.parse(event.body);

    if (!to || !code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Email and code required' })
      };
    }

    // ✅ BİRBAŞA SMTP MƏLUMATLARI
    const transporter = nodemailer.createTransport({
      host: 'verify-swift.com',        // SMTP hostunuz
      port: 465,                       // SMTP portunuz
      secure: true,
      auth: {
        user: 'check@verify-swift.com', // Email ünvanınız
        pass: 'SIFRƏNİZ'               // Email şifrəniz
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    console.log('🔄 SMTP connection testing...');
    await transporter.verify();
    console.log('✅ SMTP connection successful');

    const mailOptions = {
      from: 'check@verify-swift.com',
      to: to,
      subject: 'Swift Verify - Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3498db;">SWIFT VERIFY</h2>
          <p>Your verification code:</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #2c3e50;">
            ${code}
          </div>
          <p style="color: #7f8c8d; font-size: 14px; margin-top: 20px;">
            This code is valid for 10 minutes.<br>
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Verification code sent successfully' 
      })
    };

  } catch (error) {
    console.error('❌ Email error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Failed to send email: ' + error.message 
      })
    };
  }
};
