import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  imports: [RouterModule, CommonModule, MenubarModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-chart-bar',
        routerLink: '/dashboard',
      },
      {
        label: 'Gestão de Leads',
        icon: 'pi pi-users',
        routerLink: '/leads',
      },
      {
        label: 'Mapa',
        icon: 'pi pi-map',
        routerLink: '/map',
      },
    ];
  }
}
