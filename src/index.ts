import "reflect-metadata";
import redis from "redis";
import express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import { MikroORM } from "@mikro-orm/core";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";


const main = async () => {
  const orm = await MikroORM.init(microConfig);
  // await orm.getMigrator().up();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient({
    host: 'redis-15704.c114.us-east-1-4.ec2.cloud.redislabs.com',
    port: 15704,
    password: 'cbaYCou3GMPNMGC82Kbz8A1mphGrB2vB',
  });

  app.use(
    session({
      name: "AdminManager",
      store: new RedisStore({
        host: 'redis-15704.c114.us-east-1-4.ec2.cloud.redislabs.com',
        port: 15704,
        pass: 'cbaYCou3GMPNMGC82Kbz8A1mphGrB2vB',
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
      },
      saveUninitialized: false,
      secret: "qowiueojwojfalksdjoqiwueo",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});