import { ConfigProvider } from './config.provider';
import { DatabaseProvider } from './database.provider';

export default {
  register: () => [ConfigProvider.register(), DatabaseProvider.register()],
};
