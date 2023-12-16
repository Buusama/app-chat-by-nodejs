import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuditObserverModule } from './observers/audit-observer.module';
import { AwsModule } from './aws/aws.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { WebsocketModule } from './websocket/websocket.module';
import { FriendsModule } from './friends/friends.module';
class ApplicationModular {
  public static register() {
    return [
      UsersModule,
      BookmarksModule,
      AuthModule,
      AuditObserverModule,
      AwsModule,
      WebsocketModule,
      FriendsModule,
    ];
  }
}

export default ApplicationModular;
