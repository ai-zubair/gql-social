import { uuid } from 'uuidv4';
import { IFieldResolver } from 'graphql-tools';
import { EmptyParent, Context } from '../../types/common.type';
import { CreateUserArgs, UserUpdateArgs, DeleteArgs } from '../../types/mutation.type';

const createUser: IFieldResolver<EmptyParent, Context, CreateUserArgs> = async(parent, args, { prisma }, info) => {
  const { data :{name, email } } = args;
  const userExists = await prisma.user.findOne({
    where:{
      email
    }
  })
  if( userExists ){
    throw new Error('User already registered!')
  }else{
    const newUser = await prisma.user.create({
      data:{
        name,
        email
      }
    })
    return newUser;
  }
}

const updateUser: IFieldResolver<EmptyParent, Context, UserUpdateArgs> = async(parent, args, { prisma }, info ) => {
  const { userID, data } = args;
  const userToUpdate = await prisma.user.findOne({
    where:{
      id: userID
    }
  })
  if(userToUpdate){
    const updatedUser = await prisma.user.update({
      where: {
        id: userID
      },
      data: data
    })
    return updatedUser;
  }else{
    throw new Error("User does not exist!");
  }
}

const deleteUser: IFieldResolver<EmptyParent, Context, DeleteArgs> = async(parent, args, { prisma }, info) => {
  const {userID} = args;
  const userExists = await prisma.user.findOne({
    where:{
      id: userID
    }
  });
  if(userExists){
    const updatedUser = await prisma.user.update({
      where: {
        id: userID
      },
      data:{
        posts:{
          deleteMany:{
            authorId: userID
          }
        },
        comments:{
          deleteMany:{
            authorId: userID
          }
        }
      }
    })
    const deletedUser = await prisma.user.delete({
      where:{
        id: userID
      }
    })
    return deletedUser;
  }else{
    throw new Error("User does not exist!")
  }
}

export { 
  createUser,
  updateUser,
  deleteUser
 }