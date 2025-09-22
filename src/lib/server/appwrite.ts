import { APPWRITE_API_KEY, APPWRITE_PROJECT_ID } from "$env/static/private";
import { Client } from "node-appwrite";
import { Storage } from "node-appwrite";


const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY)


export const storage = new Storage(client)
