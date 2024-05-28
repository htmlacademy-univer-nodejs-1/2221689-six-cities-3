export const UpdateUserMessages = {
  name: {
    lengthField: 'min length is 1, max is 15',
  },
  avatarUrl: {
    invalidFormat: 'User avatar must be in the format .jpg or .png'
  }
} as const;
