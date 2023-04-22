import { CommonFunctions } from './../../../helper/common.function';
import { Component, OnInit, ViewChild } from '@angular/core';

import * as signalR from '@microsoft/signalr';
import { NotificationCountResult, NotificationResult } from '../notification';
import { NotificationService } from '../Notification.service';
import { environment } from 'src/environments/environment';
import { DialogService } from 'primeng/dynamicdialog';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-NotificationMenu',
  templateUrl: './NotificationMenu.component.html',
  styleUrls: ['./NotificationMenu.component.css'],
})
export class NotificationMenuComponent implements OnInit {
  @ViewChild('op') op: OverlayPanel | undefined;
  notification: NotificationCountResult;
  messages: Array<NotificationResult> = [];
  errorMessage = '';
  dialog: boolean;
  opModelVisible: boolean = false;
  constructor(
    private notificationService: NotificationService,
    private dialogService: DialogService
  ) {}
  isExpanded = false;

  ngOnInit() {
    this.getNotificationCount();
    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl('http://localhost:4000/notify')
      .build();

    connection
      .start()
      .then(function () {
        console.log('SignalR Connected!');
      })
      .catch(function (err) {
        return console.error(err.toString());
      });

    connection.on('BroadcastMessage', () => {
      this.getNotificationCount();
      // this.getNotificationMessage();
    });
  }

  onShow(): void {
    this.opModelVisible = true;
  }

  onHide(): void {
    this.opModelVisible = false;
  }

  mouseEnter(event: any): void {
    if (!this.opModelVisible) {
      this.opModelVisible = true;
      this.openModal(event);
    }
  }
  mouseLeave() {
    if (this.opModelVisible)
      setInterval(() => {
        this.op.hide();
        this.opModelVisible = false;
      }, 500);
  }

  getNotificationCount() {
    this.notificationService.getNotificationCount().subscribe(
      (notification) => {
        this.notification = notification;
      },
      (error) => (this.errorMessage = <any>error)
    );
  }

  getNotificationMessage() {
    this.notificationService.getNotificationMessage().subscribe(
      (messages) => {
        this.messages = [];
        // for (const prop in messages) {
        //   let jsonObj = JSON.stringify(messages[prop]);
        //   let result = JSON.parse(jsonObj) as NotificationResult;

        //   this.messages.push(result);
        // }
        this.messages = messages;
      },
      (error) => (this.errorMessage = <any>error)
    );
  }

  deleteNotifications(): void {
    if (confirm(`Are you sure want to delete all notifications?`)) {
      this.notificationService.deleteNotifications().subscribe(
        () => {
          this.closeModal();
        },
        (error: any) => (this.errorMessage = <any>error)
      );
    }
  }

  openModal(event: any) {
    this.getNotificationMessage();
    if (this.notification.Count > 0) this.op.show(event);
  }
  closeModal() {
    this.op.hide();
  }
}
