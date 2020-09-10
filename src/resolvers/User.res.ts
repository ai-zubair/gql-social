const User = {
  posts(parent, args, { db }, info){
    return db.dummyPosts.filter( post => post.author === parent.id)
  },
  comments(parent, args, { db }, info){
    return db.dummyComments.filter( comment => comment.author === parent.id )
  }
};

export { User };

