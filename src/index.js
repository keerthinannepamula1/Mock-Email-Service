const EmailService = require('./EmailService');
const EmailProvider = require('./EmailProvider');

(async () => {
    const provider1 = new EmailProvider('Provider1');
    const provider2 = new EmailProvider('Provider2');
    
    const emailService = new EmailService([provider1, provider2]);

    const email1 = { id: 'email-1', to: 'user@example.com', subject: 'Hello', body: 'Hello World!' };
    const email2 = { id: 'email-2', to: 'user2@example.com', subject: 'Hello again', body: 'Hello again World!' };

    await emailService.sendEmail(email1);
    await emailService.sendEmail(email2);

    console.log('Status:', emailService.status);
})();
