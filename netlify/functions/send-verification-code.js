const axios = require('axios');

exports.handler = async function(event, context) {
  // CORS başlıqları
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // OPTIONS sorğusu üçün
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { email, code } = JSON.parse(event.body);
    
    // E-poçt göndərmək üçün EmailJS istifadə edək
    const emailjsResponse = await sendEmailViaEmailJS(email, code);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Verification code sent successfully',
        code: code // Demo üçün
      })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Email gönderilemedi',
        details: error.message 
      })
    };
  }
};

// EmailJS ilə e-poçt göndərmə
async function sendEmailViaEmailJS(email, code) {
  const serviceID = 'your_service_id';
  const templateID = 'your_template_id';
  const userID = 'your_user_id';
  
  const emailData = {
    service_id: serviceID,
    template_id: templateID,
    user_id: userID,
    template_params: {
      to_email: email,
      verification_code: code,
      from_name: 'Swift Verify',
      reply_to: 'check@verify-swift.com'
    }
  };

  const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', emailData, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}

// Alternativ: SendGrid ilə e-poçt göndərmə
async function sendEmailViaSendGrid(email, code) {
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  
  const emailData = {
    personalizations: [{
      to: [{ email: email }],
      subject: 'Your Swift Verification Code'
    }],
    from: {
      email: 'check@verify-swift.com',
      name: 'Swift Verify'
    },
    content: [{
      type: 'text/html',
      value: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Swift Verification Code</h2>
          <p>Your verification code is:</p>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 10px; font-weight: bold; color: #333;">
            ${code}
          </div>
          <p style="color: #666; font-size: 14px;">
            This code will expire in 10 minutes.
          </p>
          <hr style="border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `
    }]
  };

  const response = await axios.post('https://api.sendgrid.com/v3/mail/send', emailData, {
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}