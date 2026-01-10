import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

import { I18N } from './core/i18n/i18n';

@Component({
  imports: [RouterModule, CommonModule, MenubarModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  protected readonly I18N = I18N;
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: I18N.MENU.DASHBOARD,
        icon: 'pi pi-chart-bar',
        routerLink: '/dashboard',
      },
      {
        label: I18N.MENU.LEADS,
        icon: 'pi pi-users',
        routerLink: '/leads',
      },
      {
        label: I18N.MENU.MAP,
        icon: 'pi pi-map',
        routerLink: '/map',
      },
    ];
  }
}
