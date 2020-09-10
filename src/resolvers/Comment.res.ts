const Comment = {
  author(parent, args, { db }, info){
    return db.dummyUsers.find( user => user.id === parent.author)
  },
  post(parent, args, { db }, info){
    return db.dummyPosts.find( post => post.id === parent.post)
  }
};

export { Comment };

