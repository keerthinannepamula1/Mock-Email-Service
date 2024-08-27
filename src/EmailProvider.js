class EmailProvider {
    constructor(name) {
        this.name = name;
        this.sentEmails = 0;
    }

    async send(email) {
        if (this.sentEmails >= this.rateLimit) {
            throw new Error(`Rate limit exceeded for ${this.name}`);
        }

        // Simulate a 30% chance of failure
        if (Math.random() > 0.7) {
            throw new Error(`${this.name} failed to send email.`);
        }

        this.sentEmails += 1;
        return true;
    }

    reset() {
        this.sentEmails = 0;
    }
}

module.exports = EmailProvider;
