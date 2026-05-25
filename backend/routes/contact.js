const express = require('express');
const router = express.Router();

// POST /api/contact - Send contact message
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email address.' });
        }

        // In a real application, you would send an email here using nodemailer or similar
        // For now, we'll just log it and return success
        console.log('📧 Contact Form Submission:');
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Message: ${message}`);
        console.log('---');

        // TODO: Implement actual email sending with nodemailer
        // Example:
        // const transporter = nodemailer.createTransport({...});
        // await transporter.sendMail({
        //     from: email,
        //     to: 'pyrohassan786@gmail.com',
        //     subject: `Contact Form: ${name}`,
        //     text: message,
        // });

        res.status(200).json({ 
            success: true,
            message: 'Message sent successfully! We will get back to you soon.' 
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Failed to send message. Please try again.' });
    }
});

module.exports = router;
