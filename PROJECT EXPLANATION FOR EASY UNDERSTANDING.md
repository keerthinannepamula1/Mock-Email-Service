## Project Explanation:
Imagine you have two toy robots. These robots can send letters (emails) to your friends for you. But sometimes, one robot might be sleepy and not send the letter correctly. 
This project makes sure that even if one robot is sleepy, the other robot can still send the letter, and it won't try to send the same letter twice by accident.

## Here’s what each part does:

**- EmailService (The Letter-Sending Boss):** This is the boss who tells the robots what to do. If one robot can’t send a letter, the boss tries again. 
If that still doesn’t work, the boss asks the other robot to send it.

**- EmailProvider (The Robots):** These are like your toy robots. They know how to send letters. Sometimes they work, and sometimes they make mistakes (on purpose, in our case, because they’re pretend robots).

**- Retry (Keep Trying):** If a robot messes up and doesn’t send a letter, the boss says, “Try again!” but waits a little longer each time.

**- Fallback (Ask for Help):** If one robot really can’t send the letter, the boss asks the other robot to do it.

**- Idempotency (No Duplicates):** The boss remembers if a letter has already been sent so it doesn’t get sent twice by mistake.

**- Rate Limiting (Not Too Fast):** The boss makes sure the robots don’t get too tired by making sure they only send a certain number of letters in a short time.

**- Status Tracking (Keep Score):** The boss keeps track of how many letters were sent, and if there were any problems, like when a robot couldn’t send a letter.

## How the Code Works:
1. The Boss (EmailService) tells Robot 1 to send a letter.
2. If Robot 1 can’t send it, the boss waits a little and tells Robot 1 to try again.
3. After a few tries, if Robot 1 still can’t do it, the boss asks Robot 2 to send the letter instead.
4. The boss makes sure the same letter isn’t sent twice, even if there were problems.
5. The boss makes sure the robots don’t send too many letters too fast so they don’t get too tired.
6. After each letter is sent, the boss checks to make sure it was sent and writes down what happened.

   
*This way, even if one robot isn’t working well, the other can still send the letters, and everything stays organized!*
