exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      SMTP_HOST: process.env.SMTP_HOST || 'NOT SET',
      SMTP_PORT: process.env.SMTP_PORT || 'NOT SET', 
      SMTP_USER: process.env.SMTP_USER || 'NOT SET',
      SMTP_PASS: process.env.SMTP_PASS ? 'SET' : 'NOT SET',
      SMTP_FROM: process.env.SMTP_FROM || 'NOT SET'
    }, null, 2)
  };
};
