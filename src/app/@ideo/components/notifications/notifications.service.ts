import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorMessages } from '@app/@shared/models/error-messages.model';
import { Observable, Subject } from 'rxjs';

export enum ReqMethod {
  PUT = 'Update',
  GET = "Get",
  POST = 'Create',
  DELETE = "Delete",
  PATCH = "Update"
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor() { }

  private addNotification: Subject<Notification> = new Subject<Notification>();

  public onNotificationEvent(): Observable<any> {
    return this.addNotification.asObservable();
  }

  public error(content: string, title: string = 'Error', duration: number = 5 * 1000, translateParamObject?: Object) {
    this.addNotification.next({
      translateParamObject,
      content,
      title,
      type: 'error',
    });
  }

  public warning(content: string, title: string = 'Warning', duration: number = 5 * 1000) {
    this.addNotification.next({
      content,
      title,
      type: 'warning',
    });
  }

  public success(
    content: string,
    title: string = 'Success',
    duration: number = 5 * 1000,
    translateParamObject?: Object
  ) {
    this.addNotification.next({
      translateParamObject,
      content,
      title,
      type: 'success',
    });
  }

  public handleError(
    err: HttpErrorResponse | HttpResponse<any>,
    entityName?: string,
    messageObj?: ErrorMessages,
    validationResult?: { errors: { [field: string]: string[] } },
    method?: 'PUT' | 'GET' | 'POST' | 'DELETE' | 'PATCH'
  ) {
    entityName = entityName || '';
    let message;
    switch (err?.status) {
      case 200:
        // Success
        message = messageObj?.[err?.status] || 'Notifications.HandleError.Success';
        if (message !== 'false') {
          this.success(message, 'Success', null, { entityName: entityName, action: `Ideo.Notification.Action.${ReqMethod?.[method || ReqMethod.PUT?.valueOf()]}` });
        }
        break;
      case 204:
        // No Content
        message = messageObj?.[err?.status] || `Notifications.HandleError.NoContent`;
        if (message !== 'false') {
          this.error(message, 'Error', null, { entityName: entityName });
        }
        break;

      case 400:
        // Validation Error
        message = (!validationResult ? 'Notifications.HandleError.ValidationError' : '');
        if (message !== 'false') {
          if (!!validationResult) {
            const errorParser = (arr: string[]) => '[' + arr.reduce((p, c, i) => `${(!!p ? p + " ," : "")}${c}`, '') + ']';
            message +=
              (
                Object.keys(validationResult).reduce(
                  (prev, curr, i) => `${(!!prev ? prev + " ," : "")}${curr}: ${errorParser(validationResult[curr])}`,
                  ''
              ))
          }
          this.warning(message);
        }
        break;
      case 403:
        // Forbidden
        message = messageObj?.[err?.status] || 'Notifications.HandleError.Forbidden';
        if (message !== 'false') {
          this.warning(message);
        }
        break;
      case 404:
        // Resource not found
        message = messageObj?.[err?.status] || 'Notifications.HandleError.NotFound';
        if (message !== 'false') {
          this.error(message, 'Not Found', null, { entityName: entityName });
        }
        break;
      // case 409:
      //   // server validation need to show server error (conflict)
      //   err = err as HttpErrorResponse;
      //   message = messageObj?.[err?.status] || err.error?.['message'] || 'Notifications.HandleError.Conflict';
      //   if (message !== 'false') {
      //     this.error(message, null, null, { entityName: entityName || 'Common.Item' });
      //   }
      //   break;
      case 409:
        // UnprocessableEntity
        err = err as HttpErrorResponse;
        message = messageObj?.[err?.status] || err.error?.['message'] || 'Notifications.HandleError.UnprocessableEntity';
        if (message !== 'false') {
          this.error(message, null, null, { entityName: entityName || 'Common.Item' });
        }
        break;
      case 500:
        // bed url
        // coronation id
        message = messageObj?.[err?.status] || 'Notifications.HandleError.BadUrl';
        if (message !== 'false') {
          this.error(message);
        }
        break;
      default:
        break;
    }
  }

  public info(content: string, title: string = 'Info', duration: number = 5 * 1000) {
    this.addNotification.next({
      content,
      title,
      type: 'info',
    });
  }

  public notify(type: NotificationType, message: string, duration: number = 5 * 1000) {
    switch (type) {
      case 'error':
        this.error(message, null, duration);
        break;
      case 'info':
        this.info(message, null, duration);
        break;
      case 'success':
        this.success(message, null, duration);
        break;
      case 'warning':
        this.warning(message, null, duration);
        break;
      default:
        break;
    }
  }
}

export type NotificationType = 'error' | 'info' | 'warning' | 'success';
export interface Notification {
  translateParamObject?: Object;
  type: NotificationType;
  title: string;
  content: string;
  duration?: number;
}