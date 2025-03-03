import { Schema, model, Document, Types } from 'mongoose';
import { UserModel } from './user.js';

// Define la interfaz para el modelo de Post
export interface IPost {
    _id?: Types.ObjectId;  // Añadir explícitamente _id  
    title: string;
    content: string;
    author: Types.ObjectId;
    comments: {
        content: string;
        author: Types.ObjectId;
        createdAt: Date;
    }[];
    createdAt: Date;
}

// Define el esquema para los comentarios embebidos
const commentSchema = new Schema({
    content: { type: String, required: true },
    author: { type: Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
});

// Define el esquema para la colección de Posts con comentarios embebidos
const postSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Types.ObjectId, ref: 'User', required: true },
    comments: [commentSchema], // Comentarios embebidos dentro del post
    createdAt: { type: Date, default: Date.now }
});

// Crea el modelo para la colección de Posts
export const PostModel = model<IPost>('Post', postSchema);