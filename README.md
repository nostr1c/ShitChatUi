# ShitShat Frontend

ShitShat is a messaging platform that allows users to create groups, send messages, and manage connections with others. 

## Features

- **User Authentication:** Register and login with JWT-based authentication.
- **Groups:** Create groups, manage group members, and send messages within groups.
- **Connections:** Send, accept, and delete connection requests between users. (WIP)
- **Messages:** Send and receive messages in groups with rich user information (username, avatar).
- **Invites:** Create and manage invites.
- **Group roles:** Create and manage group roles.

## Technologies Used

- **React 18.3.1**
- **Sass**
- **SignalR**
- **Redux**
- **Axios**
- **Docker**
- **Github Workflows for automated deploys**

## TODO

- Add logic for connections
- Fix profile page
- Refactor redux logic

## Getting Started

**1. Clone the repository:**

```bash
git clone https://github.com/nostr1c/ShitChatUi.git
cd ShitChatUi
```

**2. Start application**
```bash
docker-compose up --build
```

**App is now running at port 3000**
