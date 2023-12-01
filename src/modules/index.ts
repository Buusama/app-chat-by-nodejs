import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AuditObserverModule } from './observers/audit-observer.module';
import { AwsModule } from './aws/aws.module';
class ApplicationModular {
  public static register() {
    return [UsersModule, AuthModule, AuditObserverModule, AwsModule];
  }
}

export default ApplicationModular;
