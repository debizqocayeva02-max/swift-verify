const nodemailer = require('nodemailer');

exports.handler = async function(event, context) {
  console.log('🔧 ENV CHECK:', {
    SMTP_HOST: process.env.SMTP_HOST || 'MISSING!',
    SMTP_USER: process.env.SMTP_USER || 'MISSING!'
  });

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

  // Əgər SMTP_HOST yoxdursa, error qaytar
  if (!process.env.SMTP_HOST) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'SMTP configuration missing. Please set Environment Variables in Netlify.' 
      })
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

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Test connection
    await transporter.verify();

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: to,
      subject: 'Swift Verify - Verification Code',
      html: `... your email template ...`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);

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
