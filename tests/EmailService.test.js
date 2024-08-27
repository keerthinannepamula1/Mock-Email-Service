const EmailService = require('../src/EmailService');
const EmailProvider = require('../src/EmailProvider');

jest.setTimeout(30000); 

describe('EmailService', () => {
    let emailService;
    let primaryProvider;
    let secondaryProvider;

    beforeEach(() => {
        primaryProvider = new EmailProvider('PrimaryProvider',5);
        secondaryProvider = new EmailProvider('SecondaryProvider',5);
        emailService = new EmailService([primaryProvider, secondaryProvider], 5, 3, 30000); // Reset circuit breaker quickly for testing
    });

    it('should send email successfully', async () => {
        const email = { id: '1', to: 'test@example.com', subject: 'Test', body: 'Hello' };
        const result = await emailService.send(email);
        expect(result).toEqual('Sent');
    });

    it('should not send duplicate emails', async () => {
        const email = { id: '2', to: 'test@example.com', subject: 'Test', body: 'Hello' };
        await emailService.send(email);
        const sendSpy = jest.spyOn(primaryProvider, 'send');
        await emailService.send(email);
        expect(sendSpy).not.toHaveBeenCalled();
    });

    it('should retry on failure', async () => {
        primaryProvider.send = jest.fn().mockRejectedValue(new Error('Failed'));
        const email = { id: '3', to: 'test@example.com', subject: 'Test', body: 'Hello' };
        const sendSpy = jest.spyOn(primaryProvider, 'send');
        await emailService.send(email);
        expect(sendSpy).toHaveBeenCalledTimes(3); // Retry 3 times
    },);

    it('should fallback to secondary provider', async () => {
        primaryProvider.send = jest.fn().mockRejectedValue(new Error('Failed'));
        secondaryProvider.send = jest.fn().mockResolvedValue(true);
        const email = { id: '4', to: 'test@example.com', subject: 'Test', body: 'Hello' };
        await emailService.send(email);
        expect(primaryProvider.send).toHaveBeenCalled();
        expect(secondaryProvider.send).toHaveBeenCalled();
    });

    it('should respect rate limiting', async () => {
        const email = { id: '5', to: 'test@example.com', subject: 'Test', body: 'Hello' };
        primaryProvider.sentEmails = 5; // Simulate rate limit reached
        await expect(emailService.send(email)).rejects.toThrow('Rate limit exceeded');
    });

    it('should implement circuit breaker', async () => {
        const email = { id: '6', to: 'test@example.com', subject: 'Test', body: 'Hello' };

        // Simulate enough failures to trip the circuit breaker
        for (let i = 0; i < 5; i++) {
            try{
                await emailService.trySend(email, primaryProvider);
            }catch(e){
                //ignored
            }
        }

        // Circuit should now be open
        expect(emailService.isCircuitBreakerTripped(primaryProvider)).toBe(true);
        
        // Attempting to send should throw an error due to the circuit breaker
        await expect(emailService.send(email)).rejects.toThrow();
    });

    it('should close circuit after reset timeout', async () => {
        primaryProvider.send = jest.fn().mockRejectedValue(new Error('Failed'));
        const email = { id: '7', to: 'test@example.com', subject: 'Test', body: 'Hello' };

        // Cause the circuit to open
        for (let i = 0; i < 5; i++) {
            await emailService.send(email);
        }

        // Wait for circuit breaker to reset
        await new Promise(resolve => setTimeout(resolve, 1500));

        expect(emailService.isCircuitBreakerTripped(primaryProvider)).toBe(false);
    });

    it('should update send status', async () => {
        const email = { id: '8', to: 'test@example.com', subject: 'Test', body: 'Hello' };
        await emailService.send(email);
        expect(emailService.status[email.id]).toBe('Sent');
    });
});
