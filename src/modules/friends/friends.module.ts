import { TypeOrmModule } from "@nestjs/typeorm";
import { Bookmark } from "src/entities/bookmark.entity";
import { Friend } from "src/entities/friend.entity";
import { WebsocketModule } from "../websocket/websocket.module";
import { Module } from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { FriendsController } from "./friends.controller";
import { User } from "src/entities/user.entity";


@Module({
  imports: [TypeOrmModule.forFeature([User, Friend]), WebsocketModule],
  controllers: [FriendsController],
  providers: [FriendsService],
})
export class FriendsModule { }
