import { uuid } from 'uuidv4';

const Mutation = {
  createUser(parent, args, { db }, info){
    const {email} = args.data;
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
  },
  deleteUser(parent, args, { db }, info){
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
  },
  createPost(parent, args, { db }, info){
    const {author} = args.data;
    if(db.dummyUsers.some( user => user.id === author )){
      const newPost = {
        id: uuid(),
        ...args.data
      }
      db.dummyPosts.push(newPost);
      return newPost;
    }else{
      throw new Error("User is not registered!")
    }
  },
  deletePost(parent, args, { db }, info){
    const {postID} = args;
    const postIndex = db.dummyPosts.findIndex( post => post.id === postID );
    const postExists = postIndex >= 0;
    if(postExists){
      const deletedPost = db.dummyPosts.splice(postIndex, 1)[0];
      db.dummyComments = db.dummyComments.filter( comment => comment.post !== postID );
      return deletedPost;
    }else{
      throw new Error("Post does nto exist!");
    }
  },
  createComment(parent, args, { db }, info){
    const {post, author} = args.data;
    const postPublished = db.dummyPosts.some( savedPost => savedPost.id === post && savedPost.published );
    const userExists = db.dummyUsers.some( user => user.id === author );
    if(postPublished && userExists){
      const newComment = {
        id: uuid(),
        ...args.data
      }
      db.dummyComments.push(newComment);
      return newComment;
    }else{
      throw new Error("Post is unpublished or User does not exist!")
    }
  },
  deleteComment(parent, args, { db }, info){
    const {commentID} = args;
    const commentIndex = db.dummyComments.findIndex( comment => comment.id === commentID );
    const commentExists = commentIndex >= 0;
    if(commentExists){
      const deletedComment = db.dummyComments.splice(commentIndex, 1)[0];
      return deletedComment;
    }else{
      throw new Error("Comment does not exist!");
    }
  }
}

export { Mutation };