import { uuid } from 'uuidv4';
import { IFieldResolver } from 'graphql-tools';
import { EmptyParent, Context } from '../../types/common.type';
import { CreateUserArgs, UserUpdateArgs, DeleteArgs } from '../../types/mutation.type';

const createUser: IFieldResolver<EmptyParent, Context, CreateUserArgs> = (parent, args, { db }, info) => {
  const { data:{email} } = args;
    if( db.dummyUsers.some( user => user.email === email) ){
      throw new Error('User already registered!')
    }else{
      const newUser = {
        id: uuid(),
        ...args.data,
        active: false
      }
      db.dummyUsers.push(newUser);
      return newUser;
    }
}

const updateUser: IFieldResolver<EmptyParent, Context, UserUpdateArgs> = (parent, args, { db }, info ) => {
  const { userID, data } = args;
  const userToUpdate = db.dummyUsers.find( user => user.id === userID);
  if(userToUpdate){
    for (const updateKey in data) {
      const updateValue = data[updateKey];
      if(updateKey ==="email" && db.dummyUsers.some( user => user.email === updateValue )){
        throw new Error("Email is already in use!");
      }else if (updateValue){
        userToUpdate[updateKey] = updateValue;
      }
    }
    return userToUpdate;
  }else{
    throw new Error("User does not exist!");
  }
}

const deleteUser: IFieldResolver<EmptyParent, Context, DeleteArgs> = (parent, args, { db }, info) => {
  const {userID} = args;
  const userIndex = db.dummyUsers.findIndex( user => user.id === userID );
  const userExists = userIndex >= 0;
  if(userExists){
    const deletedUser = db.dummyUsers.splice(userIndex, 1)[0];

    db.dummyPosts = db.dummyPosts.filter( post => {
      const postByUser = post.author === userID;
      if(postByUser){
        db.dummyComments = db.dummyComments.filter( comment => comment.post !== post.id );
      }
      return !postByUser;
    })

    db.dummyComments = db.dummyComments.filter( comment => comment.author !== userID );

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