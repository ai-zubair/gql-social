const dummyPosts = [
  {id: '23l4n3lj44j55',title: 'This a Graphql course', body: 'akhdhdh kahsdkahsdkashdks d', published: false, author: "asldjhk38277e2389"},
  {id: 'sd6f6s6f8667d',title: 'This a Nodejs course', body: 'akhdhdh kahsdkahsdkashdks d', published: true, author: "b287634284b87246b"},
  {id: 'k2j3h42k3j4ha',title: 'This a React course', body: 'akhdhdh kahsdkahsdkashdks d', published: false, author: "4khj546hk457h456k"},
  {id: 'j234jlk234jkl',title: 'This a Redux course', body: 'akhdhdh kahsdkahsdkashdks d', published: true, author: "3048573n538535mm0"},
]

const dummyUsers = [
  {id: 'asldjhk38277e2389', name: 'Zubair Bashir', email: 'zub@mail.com',active: false},
  {id: 'b287634284b87246b', name: 'Nasir Bashir', email: 'nas@mail.com',active: true},
  {id: '4khj546hk457h456k', name: 'Sakib Bashir', email: 'sak@mail.com',active: true},
  {id: '3048573n538535mm0', name: 'Lubna Bashir', email: 'lub@mail.com',active: false},
]

const dummyComments = [
  {id: 'akjahk2h2k4h234', text:"this is the first comment", author: "asldjhk38277e2389", post: "23l4n3lj44j55"},
  {id: 'jk34khkh32rh800', text:"this is the second comment", author: "b287634284b87246b", post: "sd6f6s6f8667d"},
  {id: 'kjdshf4038fhh45', text:"this is the third comment", author: "4khj546hk457h456k", post: "k2j3h42k3j4ha"},
  {id: '2hh4k23u4i2h48f', text:"this is the fourth comment", author: "3048573n538535mm0", post: "j234jlk234jkl"}
]

const db = {
  dummyUsers,
  dummyPosts,
  dummyComments
}

export { db };