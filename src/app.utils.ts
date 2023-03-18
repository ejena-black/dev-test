import { Injectable, UnauthorizedException } from '@nestjs/common';

const PASSWORD_RULE = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

const PASSWORD_RULE_MESSAGE =
  'Password should have 1 uppercase, lowercase, number and special character';

const USER_RESTRICTION =
  'You are not authorized to access this route as a user';

const ADMIN_RESTRICTION =
  'You are not authorized to access this route as admin';

const LOGIN_ACCESS = 'No user with this email exits. Please signup';

export const REGEX = {
  PASSWORD_RULE,
};

export const MESSAGES = {
  PASSWORD_RULE_MESSAGE,
  USER_RESTRICTION,
  ADMIN_RESTRICTION,
  LOGIN_ACCESS,
};

// export const verifyUser = async (payload) => {
//   if (payload.role !== 'user')
//     throw new UnauthorizedException({
//       message: MESSAGES.ADMIN_RESTRICTION,
//     });

//   const wallet = await WalletService.(payload.id);

//   return {
//     balance: wallet.balance,
//     transactions: wallet.transactions,
//   };
// };

@Injectable()
export class Verification {
  async verifyUser(payload: any) {
    if (payload.role !== 'user')
      throw new UnauthorizedException({
        message: MESSAGES.ADMIN_RESTRICTION,
      });
    return true;
  }

  async verifyAdmin(payload: any) {
    if (payload.role !== 'admin')
      throw new UnauthorizedException({
        message: MESSAGES.USER_RESTRICTION,
      });

    return {
      id: payload.sub,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      address: payload.address,
      role: payload.role,
    };
  }
}
