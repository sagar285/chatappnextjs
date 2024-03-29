import { PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";

export interface GraphQLContext {
    session:Session | null;
    prisma:PrismaClient;
    // pusub
}

// users


export interface Session{
    user?:User;
    expires:ISODateString;
}

export interface User{
    id:string;
    username:string;
    image:string;
    email:string;
    name:string;

}




export interface CreateUsernameResponse {
    success?:boolean;
    error?:string;
}