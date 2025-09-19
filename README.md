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

➡️ [See full backlog & prioritization here](Saycret/Documentation).

---

##  Current Progress
At this stage, the following functionality has been implemented:
- ✅ User authentication (register, login, logout)  
- ✅ Role-based authorization (user, admin)  

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

| User Story | Story Points | Priority |
|------------|--------------|----------|
| As a user I want to register | 1 | 100 |
| As a user I want to login | 1 | 100 |
| As a user I want to post | 1 | 100 |
| As a user I want to enter my profile | 4 | 100 |
| As a user I want to like/dislike posts | 1 | 90 |
| As a user I want to repost | 2 | 90 |
| As a user I want to comment | 2 | 90 |
| As a user I want to follow other accounts | 2 | 90 |
| As a user I want to search other users | 4 | 90 |
| As a user I want to unfollow other users | 1 | 85 |
| As a user I want to see my posts | 1 | 85 |
| As a user I want to edit my profile | 2 | 85 |
| As a user I want  to like/dislike comment | 1 | 80 |
| As a user I want to post (duplicate story) | 2 | 80 |
| As a user I want to see followers number | 1 | 70 |
| As a user I don’t want to see bad words or attitudes | 1 | 70 |
| As a user I want to report a user | 1 | 60 |
| As a user I want to report a post | 1 | 60 |

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
├── Controllers/
│   ├── PostsController.mjs       # Handles posts-related logic
│   └── UsersController.mjs       # Handles users-related logic
│
├── Middlewares/
│   ├── allowedTo.mjs             # Role-based access control
│   ├── validationSchemas.mjs     # Request validation
│   └── verifyToken.mjs           # JWT authentication middleware
│
├── Errors/
│   ├── ErrorWrapper.mjs          # Error handling wrapper
│
├── Models/
│   ├── Posts.mjs                 # Post schema/model
│   └── Users.mjs                 # User schema/model
│
├── Routes/
│   ├── PostsRouts.mjs            # Routes for posts
│   └── UsersRouters.mjs          # Routes for users
│
├── Utils/
│   ├── AppError.mjs              # Custom error class
│   ├── HttpDataText.mjs          # Constants for HTTP messages
│   ├── HttpStatusText.mjs        # Constants for HTTP status codes
│   └── usersRoles.mjs            # User roles definition
│
├── .env                          # Environment variables
├── .gitignore
├── index.js                      # App entry point
├── package.json
├── package-lock.json
└── README.md
