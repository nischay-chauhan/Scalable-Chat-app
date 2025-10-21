import db , {generateId} from "../db";
import { User } from "./type";

export const addUser = async(username : string , room : string) => {
    const id = generateId();
    console.log("Adding user : " , username , " to room : " , room , " with id : " , id);
    try{
        await new Promise((resolve , reject) => {
            db.run(
                "INSERT INTO users (id , username , room) VALUES (?, ?, ?)" , 
                id, username, room,
                (error) => {
                    if(error){
                        console.log("Error adding user : " , error)
                        reject(error)
                    }else{
                        resolve(true)
                    }
                }
            )
        })
        return {success : true , user : {id , username , room}}

    }catch(error : any){
       return {success : false , error : error.toString()}
    }
}


export const removeUser = async(id : string) => {
    try{
        await new Promise((resolve , reject) => {
            db.run(
                "DELETE FROM users WHERE id = ?" , 
                id,
                (error) => {
                    if(error){
                        reject(error)
                    }else{
                        resolve(true)
                    }
                }
            )
        })
        return {success : true , message : "User removed successfully"}

    }catch(error : any){
       return {success : false , error : error.toString()}
    }
}


export const getUserByUsername = async(username : string) => {
    try{
        const user = await new Promise<any>((resolve , reject) => {
            db.all(
                "SELECT * FROM users WHERE username = ?" , 
                username,
                (error , rows) => {
                    if(error){
                        reject(error)
                    }else{
                        resolve(rows && rows[0] ? rows[0] : null)
                    }
                }
            )
        })
        return {success : true , user}

    }catch(error : any){
       return {success : false , error : error.toString()}
    }
}


export const getUsersInRoom = async (room:string) => {
    try{
        const users = await new Promise<any>((resolve , reject) => {
            db.all(
                "SELECT * FROM users WHERE room = ?" , 
                room,
                (error , rows) => {
                    if(error){
                        reject(error)
                    }else{
                        resolve(rows)
                    }
                }
            )
        })
        return {success : true , users}

    }catch(error : any){
       return {success : false , error : error.toString()}
    }
}


