import { Types } from "mongoose"

export type TMessage ={
    senderId : Types.ObjectId,
    receiverId : Types.ObjectId,
    message: string
}