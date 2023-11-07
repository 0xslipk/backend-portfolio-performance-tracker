const userType = `
  type User {
    id: ID!
    username: String!
  }
  
  type AuthSuccess {
    token: String!
  }
  
  type AuthError implements Error {
    message: String!
    username: String!
  }
  
  type UnAuthorizedError implements Error {
    message: String!
  }
  
  type UserUnableToCreateError implements Error {
    message: String!
  }
  
  union LoginResult = AuthSuccess | AuthError
  
  union CreateUserResult = User | UserUnableToCreateError
  
  type Mutation {
    login(username: String!, password: String!): LoginResult
    createUser(username: String!, password: String!): CreateUserResult
  }
`
export default userType
