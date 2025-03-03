import mongoose, { Types } from 'mongoose';
import { UserModel, IUser } from './user.js';
import { PostModel, IPost } from './post.js';
import readline from 'readline';

async function main() {
  mongoose.set('strictQuery', true); // Mantiene el comportamiento actual

  await mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar:', err));

  const user1: IUser = {
    name: 'Bill',
    email: 'bill@initech.com',
    avatar: 'https://i.imgur.com/dM7Thhn.png'
  };

  console.log("user1", user1); 
  const newUser = new UserModel(user1);
  const user2: IUser = await newUser.save();
  console.log("user2", user2);

  // findById devuelve un objeto usando el _id.
  const user3: IUser | null = await UserModel.findById(user2._id);
  console.log("user3", user3);

  // findOne devuelve un objeto usando un filtro.
  const user4: IUser | null = await UserModel.findOne({ name: 'Bill' });
  console.log("user4", user4);

  // Partial<IUser> Indica que el objeto puede tener solo algunos campos de IUser.
  // select('name email') solo devuelve name y email.
  // lean() devuelve un objeto plano de JS en lugar de un documento de Mongoose.
  const user5: Partial<IUser> | null = await UserModel.findOne({ name: 'Bill' })
    .select('name email').lean();
  console.log("user5", user5);

  // Crear un nuevo post
  let authorId: Types.ObjectId;

  if (user2 && user2._id) {
    authorId = user2._id as unknown as Types.ObjectId;
  } else {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    authorId = await new Promise<Types.ObjectId>((resolve) => {
      rl.question('Ingrese el ID del autor: ', (input) => {
        rl.close();
        resolve(new Types.ObjectId(input));
      });
    });
  }

  const post1: Partial<IPost> = {
    title: 'Primer Post',
    content: 'Este es el contenido del primer post',
    author: authorId, // Usa el _id del usuario creado o el ingresado por teclado
    comments: []
  };

  const newPost = new PostModel(post1);
  const post2: IPost = await newPost.save();
  console.log("post2", post2);

  // Leer (obtener) un post por su ID
  const post3: IPost | null = await PostModel.findById(post2._id).populate('author');
  console.log("post3", post3);

  // Actualizar un post por su ID
  const updatedPost: IPost | null = await PostModel.findByIdAndUpdate(
    post2._id,
    { title: 'Post Actualizado' },
    { new: true }
  );
  console.log("updatedPost", updatedPost);

  // Borrar un post por su ID
  const deletedPost: IPost | null = await PostModel.findByIdAndDelete(post2._id);
  console.log("deletedPost", deletedPost);

  // Listar todos los posts
  const allPosts: IPost[] = await PostModel.find().populate('author');
  console.log("allPosts", allPosts);
}

main();