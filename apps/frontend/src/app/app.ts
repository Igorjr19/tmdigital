import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { delay } from 'rxjs/operators';

@Component({
  imports: [RouterModule, CommonModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  protected apiMessage = '';
  protected loading = true;
  protected error = '';

  ngOnInit() {
    this.http
      .get('/api')
      .pipe(delay(1000))
      .subscribe({
        next: (data) => {
          this.apiMessage = (data as { message: string }).message;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Backend connection error: ' + err.message;
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }
}
