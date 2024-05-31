enum UserType {
    Regular = 'regular',
    Pro = 'pro'
}

export default class CreateUserDto {
    public email!: string;
  
    public password!: string;
  
    public name!: string;

    public type!: UserType;
}
  