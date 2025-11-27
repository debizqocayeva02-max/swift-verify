exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      context: process.env.CONTEXT || 'NOT SET',
      branch: process.env.BRANCH || 'NOT SET',
      smtp_host: process.env.SMTP_HOST || 'NOT SET',
      all_env_keys: Object.keys(process.env)
    }, null, 2)
  };
};
