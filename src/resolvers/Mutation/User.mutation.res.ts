import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { IFieldResolver } from 'graphql-tools';
import { EmptyParent, ContextWithRequestResponse, AuthTokenPayload } from '../../types/common.type';
import { UserLoginArgs, CreateUserArgs, UserUpdateArgs, DeleteArgs } from '../../types/mutation.type';
import { User } from '@prisma/client';

const loginUser:IFieldResolver<EmptyParent, ContextWithRequestResponse, UserLoginArgs> = async(parent, args, {prisma}, info):Promise<{auth: string, user: User}> =>{
  const { data:{email, password}} = args;
  const registeredUser = await prisma.user.findOne({
    where:{
      email
    }
  });
  if(registeredUser){
    const {password: userHashedPassword} = registeredUser;
    const isCorrectPassword = await compare(password, userHashedPassword);
    if(isCorrectPassword){
      const authTokenPayload: AuthTokenPayload = {
        userID: registeredUser.id
      }
      const authToken = sign(authTokenPayload,"serversecretkey");
      return {
        auth: authToken,
        user: registeredUser
      }
    }else{
      throw new Error("Incorrect Password!");
    }
  }else{
    throw new Error("User does not exist!");
  }
}

const createUser: IFieldResolver<EmptyParent, ContextWithRequestResponse, CreateUserArgs> = async(parent, args, { prisma }, info): Promise<{auth: string,user: User}> => {
  const { data :{name, email, password } } = args;
  const userExists = await prisma.user.findOne({
    where:{
      email
    }
  })
  if( userExists ){
    throw new Error('User already registered!')
  }else{
    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data:{
        name,
        email,
        password: hashedPassword
      }
    });
    const authTokenPayload: AuthTokenPayload = {
      userID: newUser.id
    }
    const authToken = sign(authTokenPayload,"serversecretkey");
    return {
      auth: authToken,
      user: newUser
    };
  }
}

const updateUser: IFieldResolver<EmptyParent, ContextWithRequestResponse, UserUpdateArgs> = async(parent, args, { prisma, request, authenticateUser }, info ) => {
  const userID = authenticateUser(request);
  const { data } = args;
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

const deleteUser: IFieldResolver<EmptyParent, ContextWithRequestResponse, DeleteArgs> = async(parent, args, { prisma, request, authenticateUser }, info) => {
  const userID = authenticateUser(request)
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
  loginUser,
  createUser,
  updateUser,
  deleteUser
 }