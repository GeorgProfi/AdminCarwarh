import { Component } from '@angular/core';
import { DebugService } from './debug.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.less'],
})
export class DebugComponent {
  constructor(private debugService: DebugService) {}

  createStation20() {
    this.debugService.createStation20().subscribe({
      next: () => {
        console.log('ok');
      },
      error: error => {
        console.error(error);
      },
    });
  }

  createService10() {
    this.debugService.createService10().subscribe({
      next: () => {
        console.log('ok');
      },
      error: error => {
        console.error(error);
      },
    });
  }

  createClient100() {
    this.debugService.createClient100().subscribe({
      next: () => {
        console.log('ok');
      },
      error: error => {
        console.error(error);
      },
    });
  }

  createNotification20() {
    this.debugService.createNotification20().subscribe({
      next: () => {
        console.log('ok');
      },
      error: error => {
        console.error(error);
      },
    });
  }

  createReservation10() {
    this.debugService.createOrder20().subscribe({
      next: () => {
        console.log('ok');
      },
      error: error => {
        console.error(error);
      },
    });
  }

  clearData() {
    this.debugService.clearData().subscribe({
      next: () => {
        console.log('ok');
      },
      error: error => {
        console.error(error);
      },
    });
  }
}
