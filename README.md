# Bob’s Corn – Accelerated 4hrs Sprint Log

I started this task at **[18:00] BOL UTC-4 2/26/2026**, I'm going to treat this task as in a accelerated 4hrs sprint or iteration, with some coffee and good music.

When I face a task that comes in a ticket like this, first I read carefully, take notes if needed.  
Notes I took at first read:

---

## 1) Data Contract

We get a data contract between Bob's system and his web clients:  

**POST requests:**  
- `200` every time clients successfully buy some corn.  
- `429 Too Many Requests` if the client is buying corn beyond rate limit.

---

## 2) Non Functional Requirements

- UI for clients to make corns petitions  
- sell at most 1 corn per client (this is the rate limit)

---

## Experience Improvements

To ensure clients get a better experience, we can add:

- Queues  
- Circuit breakers  
- Retry with exponential backoff  

---

## Tracking and Logging

For better tracking and logging (I'm assuming here Bob wants to make sure his requirements are being met, he has to be able to observe the data and requests being processed and rejected accordingly to his needs, also for compliance/audit reasons) we can use:

- Grafana  
- Loki  
- Promtail  
- NGINX  
- structured logging  

Although this can be overengineering for a simple app, would definitely be a solid foundation for future changes and extension.

---

**[18:25] Note:**  
For defining the observability stack I did some research online. Also, at this stage I would share my plan with the team if needed or mention it in a meeting as well. Document the requirements and the decision records as well. Of course, everything depending on the team's conventions and needs, in startups this can vary so much. So, my plan is:

## Plan

1) Select tech stack, document and communicate  
2) create GitHub repo and meet core reqs:  
   - **POST requests:**  
     - `200` every time clients successfully buy some corn.  
     - `429 Too Many Requests` if the client is buying corn beyond rate limit.  
   - Basic UI  
3) test and document api  
4) come back here and report status  
5) plan next steps  

---

**[18:32] We're going to use:**

- FastAPI for the server  
- React for the web client  

I will contact recruitment to double check I can work with this and move on.

---

**[18:48]** Finished sending the email and creating the repository at:  
👉 https://github.com/AlejandroJoseDeOliveiraBarrancos/Bobs-Corn  

---

**[20:06]** Pushed to main branch the initial commit covering core reqs, tested and documented both back and front ends. Also:

- Generated the gitignore from https://www.toptal.com/developers/gitignore, very helpful.  
- Used AI to speed up documentation of READMEs and development of client webapp.  

At this point Bob can start selling some corns and our project can start seeing some ROI, let's move on to the next level, v2:

Startups grow rapidly, and clients base can grow fast. Now we will focus on delivering a better experience to clients, add observability and make the server more elastic for bigger loads.

---

# Next Actions

I will divide the next actions in three: **Reliability, Observability and Elasticity.**

---

## Reliability

- Queues  
- Circuit breakers  
- Retry with exponential backoff  
- document and test  

---

## Observability

- Grafana  
- Loki  
- Promtail  
- NGINX  
- structured logging  
- document and test  

---

## Elasticity

- can configure rate limit window by env variables (validate them).  
- can deploy locally with docker compose  
- can distribute memory of clients ips so we can scale the system  
- document and test  

---

I'll start with **Elasticity**, **Reliability** and finally **Observability**. Why? In value to business order (of course, again, I will communicate with the team to know if this is the right path, validate the strategy and milestones and then go ahead)

---

**[21:07]** Just pushed the Elasticity code to `feature/Elasticity` and created and merged pull request [here](https://github.com/AlejandroJoseDeOliveiraBarrancos/Bobs-Corn/pull/1).

- Used AI to speed up Docker ignore, Docker images and docker compose files creation.  
- Researched the web for redis rate limiting approaches, followed this one:  
  https://snir-orlanczyk.medium.com/fastapi-rate-limit-middleware-ec9e46f84cdb  

---

## Reliability Assessment

For the Reliability features, I did an assessment and I will only add:

- Health checks  
- Redis timeout = 1s  
- Fail-open on Redis failure  
- Client respects Retry-After (backoff)  

Nothing too robust because we don't have heavy or long running operations yet, so this can wait for further versions. Let's go.

---

**[21:30]** Just pushed and merged PR from [here](https://github.com/AlejandroJoseDeOliveiraBarrancos/Bobs-Corn/pull/2).

---

# End of Sprint

I will stop the exercise here. What would I do next?

I would continue with the Observability branch if there's no other priority for the team and keep looking for things to improve Bob's system. For example, here are a few things:

---

## Security

- Improve CORS logic  
- Add identity to users  
- Authenticate users with google identities (fastest for small startups, easiest to extend)  
- Start protecting the backend with a gateway  

---

## Automation

- Automate CICD flows with pipelines (for now testing, building, flag and deployment might suffice)  

---

## UI

- Allow users to know how much they have to wait until next opportunity to buy the product(s)  
- Allow users to make reservations (this could be great for the business, specially if Bob plays in the big leagues)  

---

This is the end of the development sprint, I focused on showcasing a common 4hrs of my work and how I'd approach the presented problems. I also focused on enjoying this time and really did.

See the loom video [here](https://www.loom.com/share/7078282d9da545b08f06cfd16a150f44)

Thanks for the task!