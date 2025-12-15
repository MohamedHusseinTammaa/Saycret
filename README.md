## 📖 About the Project
Saycret is a social media platform that empowers users to share their thoughts, ideas, and confessions in two ways:  
- **Publicly with their real name** to build connections and express themselves openly.  
- **Anonymously without revealing identity** to create a safe space for honest expression.  

The app is designed to combine the openness of social media with the privacy of anonymous sharing, giving users the freedom to choose how they want to interact.  

---

## 🚀 Development Approach

This project was developed following **Agile principles**:

- **User Stories**: Defined the application features from the perspective of the end-user.  
- **Prioritization**: Each story was assigned a **priority** and **story points** based on effort and business value.  
- **Backlog Management**: Features were organized and refined to plan development iterations.  
- **Incremental Delivery**: The first increment focused on **Authentication & Authorization** to establish a secure foundation.  

📌 Example User Stories:
- As a user, I want to **register** so that I can create an account.  
- As a user, I want to **login** so that I can access my account securely.  
- As a user, I want to **post anonymously** so that I can share without revealing my identity.  

➡️ [See full backlog & prioritization here](Documentation).

---
## 📅 Sprint Progress

### Sprint 1 (✅ Completed)
- Implemented Authentication & Authorization
- Completed Stories: Register (#1), Login (#2)

### Sprint 2 (✅ Completed)
- Focus on Post, Profile, Like/Dislike features
- Planned Stories: Post (#3), Enter Profile (#4), Like/Dislike (#5)

### Sprint 3 (✅ Completed)
- Focus on Comments
- Planned Stories: As a user I want to comment , As a user I want  to like/dislike comment

### Sprint 4 ( in progress)
- Follow Other Accounts
- Unfollow Other Users
- Search Other Users
---

The project is still under development. Upcoming features will be implemented based on the prioritized user stories.
### Planned
- User profile management  
- Posting system (public & anonymous posts)  
- Like/dislike system  
- Reposting  
- Comments  
- Following/unfollowing users  
- Real-time feed with WebSockets/SignalR alternative  
- Content moderation (filtering bad words)  

---

## 📝 Analysis & Planning  

During the analysis phase, the system was broken down into **user stories**, each assigned **story points** (effort/complexity) and a **priority** score (business value).  

| User Story | Story Points | Priority | progress |
|------------|--------------|----------|----------|
| As a user I want to see a feed of posts | 2 | 100 | ⬜ |
| As a user I want to see posts from people I follow | 2 | 95 | ⬜ |
| As a user I want to see the latest posts first | 1 | 85 | ⬜ |
| As a user I want to refresh my feed | 1 | 80 | ⬜ |
| As a user I want to see popular posts | 2 | 75 | ⬜ |
| As a user I want my feed to exclude blocked users | 1 | 75 | ⬜ |
| As a user I want to load more posts | 2 | 80 | ⬜ |
| As a user I want to register | 1 | 100 | ✅ |
| As a user I want to login | 1 | 100 | ✅ |
| As a user I want to logout | 1 | 95 | ✅ |
| As a user I want to post | 1 | 100 | ✅ |
| As a user I want to see my posts | 1 | 85 | ✅ |
| As a user I want to comment | 2 | 90 | ✅ |
| As a user I want to like/dislike posts | 1 | 90 | ✅ |
| As a user I want to like/dislike comments | 1 | 80 | ✅ |
| As a user I want to enter my profile | 4 | 100 | ✅ |
| As a user I want to edit my profile | 2 | 85 | ⬜ |
| As a user I want to follow other accounts | 2 | 90 | ✅ |
| As a user I want to unfollow other users | 1 | 85 | ✅ |
| As a user I want to see followers number | 1 | 70 | ✅ |
| As a user I want to search other users | 4 | 90 | ✅ |
| As a user I want to edit my post | 2 | 85 | ✅ |
| As a user I want to delete my post | 1 | 90 | ✅ |
| As a user I want to delete my comment | 1 | 80 | ✅ |
| As a user I want to see who liked my post | 2 | 85 | ✅ |
| As a user I want to receive notifications | 3 | 90 | ⬜ |
| As a user I want offensive words to be filtered | 1 | 70 | ⬜ |
| As a user I want to block another user | 2 | 75 | ⬜ |
| As a user I want to mute another user | 1 | 70 | ⬜ |
| As a user I want to report a user | 1 | 60 | ⬜ |
| As a user I want to report a post | 1 | 60 | ⬜ |
| As an admin I want to review reported content | 3 | 60 | ⬜ |



This prioritization guided the decision to implement **authentication and authorization first** as the project’s foundation.  

---

## 🔮 Roadmap
Next priorities in development:
1. User profiles  
2. Posting system (public & anonymous)  
3. Interaction features (likes, comments, reposts)  
4. Social graph (follow/unfollow, search users)  
5. Real-time updates  
6. Moderation & filters  

---

## 🛠️ Tech Stack
- **Backend:** Node.js + Express  
- **Database:** MongoDB / SQL (specify which one you’re using)  
- **Authentication:** JWT + bcrypt  
- **Real-time Communication:** WebSockets (planned)  
- **Frontend (planned):** React.js or templating engine  

---

## 📂 Project Structure

```bash
Saycret/
documentation
src
├── Controllers
|
├── Domain
│   ├── Interfaces
│   │   
│   └── Models
│       
├── DTOs
│
├── Middlewares
│   ├── Errors
│
├── Routes
│   ├── PostsRouts.ts
│   └── UsersRouters.ts
│
├── Services
│
└── Utils
|
.env
node_modules
├── .gitignore
├── index.js                      # App entry point
├── package.json
├── package-lock.json
└── README.md
