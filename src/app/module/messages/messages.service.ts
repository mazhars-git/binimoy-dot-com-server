import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TMessage } from './messages.interface';
import { StatusCodes } from 'http-status-codes';
import { Message } from './messages.model';
import mongoose from 'mongoose';

const createMessagesBetweenUsers = async (payload: TMessage) => {
  const { message, senderId, receiverId } = payload;

  const [sender, receiver] = await Promise.all([
    User.findById(senderId),
    User.findById(receiverId),
  ]);

  if (!sender || !receiver) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Sender or receiver user not found.',
    );
  }

  if (senderId === receiverId) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'Action not allowed: You cannot initiate a chat on your own product.',
    );
  }

  if (!message || message.trim() === '') {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'Message content cannot be empty.',
    );
  }

  const newMessage = await Message.create({
    senderId: new mongoose.Types.ObjectId(senderId),
    receiverId: new mongoose.Types.ObjectId(receiverId),
    message,
  });

  return newMessage;
};



const getMessagesBetweenUsers = async (userA: string, userB: string) => {

    if (!userA || !userB) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Both sender and receiver user IDs are required.'
      );
    }
  
    if (userA === userB) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'You cannot get conversation history with yourself.'
      );
    }
  
    const messages = await Message.find({
      $or: [
        { senderId: userA, receiverId: userB },
        { senderId: userB, receiverId: userA },
      ],
    })
      .sort({ createdAt: 1 }) // Oldest first
      .populate('senderId', 'name email')
      .populate('receiverId', 'name email');
  
    if (!messages || messages.length === 0) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'No conversation history found between these users.'
      );
    }
  
    return messages;
  };


  export const MessageService ={
    createMessagesBetweenUsers,
    getMessagesBetweenUsers
  }
