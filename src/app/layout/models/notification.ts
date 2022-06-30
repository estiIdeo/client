// import { NotificationTypeConverter } from '@core/mapper/converters/NotificationTypeConverter';
// import { NotificationPriorityConverter } from '@core/mapper/converters/NotificationPriorityConverter';

export class Notification {
  description: string;
  time: string;

  // @NotificationTypeConverter()
  type: string;

  // @NotificationPriorityConverter()
  priority: string;

  constructor() {}
}
