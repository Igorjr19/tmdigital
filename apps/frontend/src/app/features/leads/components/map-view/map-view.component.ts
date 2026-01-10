import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EnvironmentInjector,
  OnInit,
  ViewChild,
  createComponent,
  effect,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as leaflet from 'leaflet';
import { ButtonModule } from 'primeng/button';
import { LeadDto } from '../../../../api/model/models';
import { RuralPropertyWithLocation } from '../../models/lead.extension';
import { LeadsFacadeService } from '../../services/leads.facade';
import { MapPopupComponent } from '../map-popup/map-popup.component';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapViewComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private leadsFacade = inject(LeadsFacadeService);
  private injector = inject(EnvironmentInjector);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private map: leaflet.Map | undefined;
  private markers: leaflet.LayerGroup | undefined;

  constructor() {
    effect(() => {
      const properties = this.leadsFacade.allProperties();
      this.updateMarkers(properties);
    });
  }

  ngOnInit() {
    this.leadsFacade.loadAllLeadsForDashboard();
  }

  ngAfterViewInit() {
    this.initMap();
  }

  goBack() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  private initMap() {
    this.map = leaflet
      .map(this.mapContainer.nativeElement)
      .setView([-14.235004, -51.92528], 4);

    leaflet
      .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      })
      .addTo(this.map);

    this.markers = leaflet.layerGroup().addTo(this.map);

    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = leaflet.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
    leaflet.Marker.prototype.options.icon = iconDefault;

    this.updateMarkers(this.leadsFacade.allProperties());
  }

  private updateMarkers(
    properties: (RuralPropertyWithLocation & {
      leadStatus?: LeadDto.StatusEnum;
      leadName?: string;
    })[],
  ) {
    if (!this.map || !this.markers) {
      return;
    }

    this.markers.clearLayers();

    properties.forEach((prop) => {
      const loc = prop.location;
      if (loc && loc.coordinates) {
        const [lng, lat] = loc.coordinates;
        const status = prop.leadStatus || '';

        const marker = leaflet.marker([lat, lng]);

        const componentRef = createComponent(MapPopupComponent, {
          environmentInjector: this.injector,
        });

        componentRef.instance.propertyName = prop.name;
        componentRef.instance.culture = prop.productiveAreaHectares
          ? 'Soja/Milho (Est.)'
          : 'N/A';
        componentRef.instance.leadStatus = status;

        componentRef.changeDetectorRef.detectChanges();

        marker.bindPopup(componentRef.location.nativeElement);
        this.markers?.addLayer(marker);
      }
    });

    if (this.markers.getLayers().length > 0) {
      const group = new leaflet.FeatureGroup(
        this.markers.getLayers() as leaflet.Layer[],
      );
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }
}
