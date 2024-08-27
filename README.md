# Mock-Email-Service

*This project implements a resilient JavaScript email service with retry logic, fallback to a secondary provider, idempotency to prevent duplicates, and rate limiting. It includes status tracking, a circuit breaker pattern for failure handling, simple logging, and a basic queue system, ensuring reliable email delivery.*

---

## 1. Project Concept


The Resilient Email Sending Service is designed to ensure reliable and efficient email delivery even under challenging conditions. It integrates with two mock email providers and incorporates advanced features like retry logic, fallback mechanisms, idempotency, rate limiting, and status tracking. The project aims to provide a robust solution that can handle transient failures, avoid duplicate emails, and manage provider limitations, ensuring emails are sent smoothly and reliably.

### Key Features:

**1. Retry Mechanism:** Automatically retries failed email sends with exponential backoff to handle temporary issues.


**2. Fallback to Secondary Provider:** If the primary provider fails, the service switches to a secondary provider to ensure delivery.


**3. Idempotency:**  Prevents duplicate email sends by ensuring each email is sent only once, even if the send operation is retried.


**4. Rate Limiting:** Controls the number of emails sent in a given time frame to avoid overloading the email providers.


**5.Status Tracking:** Monitors and logs the status of each email sending attempt for transparency and debugging.

### Bonus Features:
**- Circuit Breaker Pattern:** Temporarily halts email sending after multiple consecutive failures, protecting the system from further issues.


**- Simple Logging:** Provides basic logs to track email sending operations.


**- Basic Queue System:** Manages email sending requests in a queue, ensuring orderly processing.

---

## 2. Implementation

The implementation is focused on creating a resilient email service that integrates well with external email providers and handles common issues encountered in real-world scenarios.

### Core Components:
**1. EmailService Class:** The main class responsible for sending emails, managing retries, handling fallback logic, and ensuring idempotency.


**2. EmailProvider Class:** Represents the mock email providers with methods for sending emails and simulating failures.


**3. Retry Mechanism:** Uses exponential backoff to retry sending an email after a failure, with increasing intervals between attempts.


**4. Fallback Logic:** If the primary provider fails, the system automatically switches to a secondary provider.


**5. Circuit Breaker:** A design pattern that temporarily halts operations after a predefined number of failures to prevent further damage.


**6. Logging:** Provides insights into the email sending process, including successes, retries, and failures.

--- 

## 3. Technologies Used

**JavaScript:** The primary programming language used for the entire project.

**Node.js:** The runtime environment for executing JavaScript code on the server.

**Jest:** A testing framework used to write and run unit tests to ensure the correctness of the service.

---

## 4. Setup Instructions

### Prerequisites:

**Node.js:** Ensure that Node.js is installed on your system.

**npm:** Node Package Manager, which comes with Node.js, is used to install dependencies.

### Steps:


**1. Clone the Repository:**

`code`
git clone <repository-url>
cd <repository-directory>


**2. Install Dependencies:**

`code`
npm install


**3. Run the Tests:**

`code`
npm test


**4. Run the Service:**

`code`
node src/index.js

---

## 5. Assumptions vs. Reality
### Assumptions:
**Providers Always Respond:** It’s assumed that the email providers will always respond to requests, whether successfully or with an error.

**Retry Logic Will Always Work:** Assumes that retrying with exponential backoff will eventually lead to a successful email send.

**Rate Limiting is Straightforward:** Assumes that rate limiting will be easy to implement and manage within the service.


### Reality:
**Unresponsive Providers:** In real-world scenarios, an email provider may become completely unresponsive, requiring additional error handling and potentially more advanced fallback strategies.

**Retry Logic Needs Tuning:** In practice, retry logic may need to be tuned based on the specific behavior of email providers and the types of errors encountered.

**Complex Rate Limiting:** Implementing rate limiting involves more complexity, especially when handling bursts of emails and ensuring compliance with provider limits without dropping requests.

[![Watch the video](https://raw.githubusercontent.com/keerthinannepamula1/Mock-Email-Service/blob/main/local_testing_Demo%20-%20COMPRESS.mp4)
