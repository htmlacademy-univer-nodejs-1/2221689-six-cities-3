import { UserType } from "../../const";

export default class UserWithTokenDto {
    public email!: string ;
  
    public avatarUrl!: string;
  
    public type!: UserType;
  
    public name!: string;
  
    public token!: string;
  }