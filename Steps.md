# Steps

## How this server was build

[x] Git setup

- git init
- git remote add origin <https://github.com/yourgit.git>
- git add .
- git commit -m "Initial commit"
- git push -u origin master

[x] Type Script for node

- yarn add -D @types/node typescript
- yarn add -D ts-node
- npx tsconfig.json (pickup node)
- yarn add -D nodemon

[x] MongoDB

- MongoDB Database Setup
- MongoDB Client Setup
- yarn add @mikro-orm/cli @mikro-orm/migrations @mikro-orm/core @mikro-orm/mongodb

[x] Apollo Graphql

- Setup Apollo Client
- Basic Resolvers (Register, Login)

[x] Session Express

- Express-Session
- Redis database Session (Serveles)
- Redis-Cli Setup
