import { IUser } from 'models/users/user.model';

declare module 'next' {
  interface NextApiRequest {
    user?: IUser;
  }
}
