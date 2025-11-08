# ShitChat Frontend

ShitChat is a messaging platform that allows users to create groups, send messages, handle roles, invites and bans.

## Features

- **User Authentication:** Register and login with JWT-based authentication.
- **Groups:** Create groups, edit and delete groups.
- **Connections:** Send, accept, and delete connection requests between users. (Only backend support for now)
- **Invites:** Create and manage invites.
- **Group roles:** Create and manage group roles with different permissions.
-  **Send messages:** Send realtime messages within a group.

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
