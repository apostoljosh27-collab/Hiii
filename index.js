
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email, otp, fullname) {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('Email credentials not configured');
            return false;
        }

        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification - Share Boost</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f5f7fa;
                    line-height: 1.6;
                    color: #333;
                }
                
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }
                
                .header {
                    background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
                    padding: 40px 30px;
                    text-align: center;
                    color: white;
                }
                
                .header h1 {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 8px;
                    letter-spacing: -0.5px;
                }
                
                .header p {
                    font-size: 16px;
                    opacity: 0.9;
                    font-weight: 400;
                }
                
                .content {
                    padding: 40px 30px;
                }
                
                .greeting {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1a202c;
                    margin-bottom: 20px;
                }
                
                .message {
                    font-size: 16px;
                    color: #4a5568;
                    margin-bottom: 30px;
                    line-height: 1.7;
                }
                
                .otp-container {
                    background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                    border: 2px solid #8B5CF6;
                    border-radius: 12px;
                    padding: 30px;
                    text-align: center;
                    margin: 30px 0;
                    position: relative;
                    overflow: hidden;
                }
                
                .otp-label {
                    font-size: 14px;
                    color: #8B5CF6;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 15px;
                }
                
                .otp-code {
                    font-size: 36px;
                    font-weight: 800;
                    color: #1a202c;
                    letter-spacing: 8px;
                    margin: 15px 0;
                    font-family: 'Courier New', monospace;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                .otp-validity {
                    font-size: 14px;
                    color: #718096;
                    font-weight: 500;
                }
                
                .footer {
                    background-color: #f7fafc;
                    padding: 30px;
                    text-align: center;
                    border-top: 1px solid #e2e8f0;
                }
                
                .footer-text {
                    font-size: 14px;
                    color: #718096;
                    margin-bottom: 15px;
                    line-height: 1.6;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Share Boost</h1>
                    <p>Verify Your Email Address</p>
                </div>
                
                <div class="content">
                    <div class="greeting">Hello ${fullname || 'User'}!</div>
                    
                    <div class="message">
                        Welcome to Share Boost! We're excited to have you on board. To complete your registration and secure your account, please verify your email address using the verification code below.
                    </div>
                    
                    <div class="otp-container">
                        <div class="otp-label">Verification Code</div>
                        <div class="otp-code">${otp}</div>
                        <div class="otp-validity">Valid for 5 minutes</div>
                    </div>
                    
                    <div class="message">
                        Simply enter this 6-digit code in the verification field on our website to activate your account and start boosting your social media presence.
                    </div>
                </div>
                
                <div class="footer">
                    <div class="footer-text">
                        This email was sent to <strong>${email}</strong> because you requested email verification for Share Boost.
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: {
                name: 'Share Boost',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: `${otp} - Your Share Boost Verification Code`,
            html: htmlContent,
            text: `Hello ${fullname || 'User'},

Welcome to Share Boost! Your email verification code is: ${otp}

This code will expire in 5 minutes. Please enter it on the verification page to complete your registration.

Security reminders:
- Never share this code with anyone
- This code can only be used once
- If you didn't request this, please ignore this email

Need help? Contact us at: https://facebook.com/joshuaapostol2006

Best regards,
Share Boost Team`
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent successfully to ${email}`);
        return true;

    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
}

async function sendPasswordResetOTP(email, otp, fullname) {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error('Email credentials not configured');
            return false;
        }

        const transporter = nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset - Share Boost</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f5f7fa;
                    line-height: 1.6;
                    color: #333;
                }
                
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }
                
                .header {
                    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                    padding: 40px 30px;
                    text-align: center;
                    color: white;
                }
                
                .header h1 {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 8px;
                    letter-spacing: -0.5px;
                }
                
                .header p {
                    font-size: 16px;
                    opacity: 0.9;
                    font-weight: 400;
                }
                
                .content {
                    padding: 40px 30px;
                }
                
                .greeting {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1a202c;
                    margin-bottom: 20px;
                }
                
                .message {
                    font-size: 16px;
                    color: #4a5568;
                    margin-bottom: 30px;
                    line-height: 1.7;
                }
                
                .otp-container {
                    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
                    border: 2px solid #ef4444;
                    border-radius: 12px;
                    padding: 30px;
                    text-align: center;
                    margin: 30px 0;
                    position: relative;
                    overflow: hidden;
                }
                
                .otp-label {
                    font-size: 14px;
                    color: #ef4444;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 15px;
                }
                
                .otp-code {
                    font-size: 36px;
                    font-weight: 800;
                    color: #1a202c;
                    letter-spacing: 8px;
                    margin: 15px 0;
                    font-family: 'Courier New', monospace;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                .otp-validity {
                    font-size: 14px;
                    color: #718096;
                    font-weight: 500;
                }
                
                .footer {
                    background-color: #f7fafc;
                    padding: 30px;
                    text-align: center;
                    border-top: 1px solid #e2e8f0;
                }
                
                .footer-text {
                    font-size: 14px;
                    color: #718096;
                    margin-bottom: 15px;
                    line-height: 1.6;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Password Reset</h1>
                    <p>Reset Your Share Boost Password</p>
                </div>
                
                <div class="content">
                    <div class="greeting">Hello ${fullname || 'User'}!</div>
                    
                    <div class="message">
                        We received a request to reset your Share Boost account password. If you made this request, please use the verification code below to proceed with resetting your password.
                    </div>
                    
                    <div class="otp-container">
                        <div class="otp-label">Password Reset Code</div>
                        <div class="otp-code">${otp}</div>
                        <div class="otp-validity">Valid for 5 minutes</div>
                    </div>
                    
                    <div class="message">
                        Enter this code on the password reset page to create a new password for your account.
                    </div>
                </div>
                
                <div class="footer">
                    <div class="footer-text">
                        If you didn't request this password reset, please contact our support team immediately.
                    </div>
                    <div class="footer-text">
                        This email was sent to <strong>${email}</strong> for your Share Boost account security.
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: {
                name: 'Share Boost Security',
                address: process.env.EMAIL_USER
            },
            to: email,
            subject: `${otp} - Your Password Reset Code`,
            html: htmlContent,
            text: `Hello ${fullname || 'User'},

We received a request to reset your Share Boost account password.

Your password reset code is: ${otp}

This code will expire in 5 minutes. If you didn't request this password reset, please ignore this email.

Security reminders:
- Do not share this code with anyone
- This code expires in 5 minutes
- Contact support if you suspect unauthorized access

Need help? Contact us at: https://facebook.com/joshuaapostol2006

Best regards,
Share Boost Security Team`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Password reset OTP email sent successfully to ${email}`);
        return true;

    } catch (error) {
        console.error('Error sending password reset OTP email:', error);
        return false;
    }
}

// API Endpoints
app.post('/api/send-otp', async (req, res) => {
    try {
        const { email, fullname, type = 'verification' } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        const otp = generateOTP();
        let emailSent = false;

        if (type === 'password_reset') {
            emailSent = await sendPasswordResetOTP(email, otp, fullname);
        } else {
            emailSent = await sendOTPEmail(email, otp, fullname);
        }

        if (emailSent) {
            res.status(200).json({
                success: true,
                message: 'OTP sent successfully',
                otp: otp // In production, don't return OTP in response
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to send email'
            });
        }

    } catch (error) {
        console.error('Email API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Email API is running',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Email API server running at http://0.0.0.0:${PORT}`);
});
