import { AbstractRepository } from "@app/common/database";
import { Injectable, Logger } from "@nestjs/common";
import { UsersDocument } from "./schema/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class UsersRepository extends AbstractRepository<UsersDocument>{
    protected logger: Logger = new Logger(UsersRepository.name);

    constructor(@InjectModel(UsersDocument.name) usersModel: Model<UsersDocument>){
        super(usersModel)
    }

}