const Query = {
  posts(parent, args, { db }, info){
    const keyword: string | null = args.keyword;
    if(keyword){ 
      return db.dummyPosts.filter( post => post.title.toLowerCase().includes(keyword.toLowerCase()) )
    }else{
      return db.dummyPosts;
    }
  },
  users(parent, args, { db }, info){
    const keyword: string | null = args.keyword;
    if(keyword){
      return db.dummyUsers.filter( user => user.name.toLowerCase().includes(keyword.toLowerCase()) )
    }else{
      return db.dummyUsers;
    }
  },
  comments(parent, args, { db }, info){
    return db.dummyComments;
  }
}

export { Query };