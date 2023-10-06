import { Injectable } from "@nestjs/common";
import { CreateEmailDto } from "../email/dto/create-email";
import { MailDto } from "./dto/mailDto";

@Injectable()
export class forgetPasswordService {
  async findEmail(email: MailDto) {}
}
