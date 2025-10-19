import db, { generateId } from "../db";
import { ChatMessage } from "./type";
import { getUserByUsername } from "./user";


export const addMessage = async(msg : ChatMessage) => {
    const id = generateId();
    try{
        const { success, user, error: userError } = await getUserByUsername(msg.username);
        if (!success || !user) {
            throw new Error(userError || `User not found for username: ${msg.username}`);
        }
        await new Promise<void>((resolve , reject) => {
            db.run(
                "INSERT INTO messages (id , user_id , room , text) VALUES (?, ?, ?, ?)" , 
                [id , user.id , msg.room , msg.text] ,
                (error) => {
                    if(error){
                        reject(error)
                    }else{
                        resolve()
                    }
                }
            )
        })
        return {success : true , message : "Message added successfully"}
    }catch(error : any){
        return {success : false , error : error.toString()}
    }
}