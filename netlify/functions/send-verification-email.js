exports.handler = async (event) => {
    console.log('Function called', event.body);
    
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { to, verificationCode, reference } = JSON.parse(event.body);
        
        // Sadəcə log yazırıq, real email göndərmirik
        console.log('Email details:', { to, verificationCode, reference });
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                message: 'Verification code sent successfully'
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                message: 'Demo mode: Code would be sent to ' + (event.body ? JSON.parse(event.body).to : 'unknown')
            })
        };
    }
};
