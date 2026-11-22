import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { admin } from "better-auth/plugins";

const uri = process.env.BETTER_AUTH_DB_URI as string;
const globalForMongo = globalThis as unknown as {
  _mongoClient?: MongoClient;
  _mongoClientPromise?: Promise<MongoClient>;
};

const client = globalForMongo._mongoClient ?? new MongoClient(uri);
globalForMongo._mongoClient = client;

if (!globalForMongo._mongoClientPromise) {
  globalForMongo._mongoClientPromise = client.connect();
}

await globalForMongo._mongoClientPromise;

const db = client.db("luma");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: { 
    enabled: true, 
  },
  user: {
       additionalFields: {
          role: {
              type: ['patrons', 'admin'],
              defaultValue: "patrons",
              input: false
            },
          phoneNumber: {
              type: "string",
              required: false,
              input: true
            }
        }
    },
 socialProviders: {
        google: { 
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
  plugins: [
    admin({
      defaultRole: "patrons",
    }),
  ],
});