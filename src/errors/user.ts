export function AuthError(username: string) {
  return {
    __typename: 'AuthError',
    message: 'Unable to login',
    username,
  }
}

export function UnAuthorizedError() {
  return {
    __typename: 'UnAuthorizedError',
    message: 'Unauthorized',
  }
}

export function UserUnableToCreateError() {
  return {
    __typename: 'UserUnableToCreateError',
    message: 'Unable to create user.',
  }
}
