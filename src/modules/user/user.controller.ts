import { Controller } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('auths')
export class UserController {
  constructor(private userService: UserService) {}
}
