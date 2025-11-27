exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      SMTP_HOST: process.env.SMTP_HOST || '❌ NOT SET',
      SMTP_USER: process.env.SMTP_USER || '❌ NOT SET', 
      SMTP_PASS: process.env.SMTP_PASS ? '✅ SET' : '❌ NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET'
    }, null, 2)
  };
};
