import { SignUpRole } from "../../enums/auth/sign-up-role.enum";

export interface SignUpDto {
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    role: SignUpRole;
  }
  