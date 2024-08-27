class EmailService {
    constructor(providers, rateLimit = 5, retryCount = 3, resetTimeout = 30000) {
        this.providers = providers;
        this.status = {};
        this.sentEmails = new Set();
        this.queue = [];
        this.rateLimit = 5;
        this.retryCount = retryCount;
        this.providerFailures = new Map();
        this.circuitBreakerThreshold = 5;
        this.resetTimeout = resetTimeout;
        this.providerCircuitStatus = new Map();
    }

    async send(email) {
        if (this.sentEmails.has(email.id)) {
            return this.status[email.id];
        }

        this.sentEmails.add(email.id);
        this.queue.push(email);
        return this.processQueue();
    }

    async processQueue() {
        let emailStatus = 'True';
        while (this.queue.length > 0) {
            const email = this.queue.shift();
            let success = false;
            for (let provider of this.providers) {
                if (this.isCircuitBreakerTripped(provider)) continue;

                success = await this.trySend(email, provider);
                if (success) break;
            }

            this.status[email.id] = success ? 'Sent' : 'Failed';
            return this.status[email.id];
        }
    }

    async trySend(email, provider, attempt = 1) {
        try {
            await this.checkRateLimit(provider);
            await provider.send(email);
            this.log(`Email sent successfully via ${provider.name}`);
            this.resetFailureCount(provider);
            return true;
        } catch (error) {
            this.log(`Attempt ${attempt} failed via ${provider.name}: ${error.message}`);
            this.incrementFailureCount(provider);

            // Check if the error is due to rate limiting
            if (error.message.includes('Rate limit exceeded')) {
                throw error; // Propagate the rate limit error
            }
        
            if (attempt < this.retryCount) {
                await this.exponentialBackoff(attempt); // Wait before retrying
                return await this.trySend(email, provider, attempt + 1); // Retry with the next attempt
            }

            // If retries are exhausted, return false
            return false;
        }
    }

    async checkRateLimit(provider) {
        if (provider.sentEmails >= this.rateLimit) {
            this.log(`${provider.name} has reached the rate limit. Delaying email...`);
            throw new Error(`Rate limit exceeded for ${provider.name}`);
        }
    }

    async exponentialBackoff(attempt) {
        return new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
    }

    incrementFailureCount(provider) {
        if (!this.providerFailures.has(provider.name)) {
            this.providerFailures.set(provider.name, 0);
        }
        const failures = this.providerFailures.get(provider.name) + 1;
        this.providerFailures.set(provider.name, failures);

        if (failures >= 5) {
            this.providerCircuitStatus.set(provider.name, 'OPEN');
            this.log(`${provider.name} circuit breaker tripped!`);
            setTimeout(() => {
                this.providerCircuitStatus.set(provider.name, 'CLOSED');
                this.providerFailures.set(provider.name, 0);
                this.log(`${provider.name} circuit breaker reset.`);
            }, this.resetTimeout());
        }
    }

    resetFailureCount(provider) {
        this.providerFailures.set(provider.name, 0);
        this.providerCircuitStatus.set(provider.name, 'CLOSED');
    }

    isCircuitBreakerTripped(provider) {
        return this.providerCircuitStatus.get(provider.name) == 'CLOSED';
    }

    log(message) {
        console.log(`[${new Date().toISOString()}] ${message}`);
    }
}

module.exports = EmailService;
