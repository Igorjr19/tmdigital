import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import * as leaflet from 'leaflet';
import 'leaflet.heat'; // Import plugin
import { DashboardGeoStatsDtoHeatmapInner } from '../../../../api/model/models';

@Component({
  selector: 'app-heatmap-view',
  standalone: true,
  imports: [CommonModule],
  template: `<div
    #mapContainer
    class="map-container"
    style="height: 400px; width: 100%; border-radius: 8px;"
  ></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeatmapViewComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private _heatmapData: DashboardGeoStatsDtoHeatmapInner[] | null = null;
  @Input()
  set heatmapData(value: DashboardGeoStatsDtoHeatmapInner[] | null) {
    this._heatmapData = value;
    if (this.map && value) {
      this.updateHeatmap(value);
    }
  }
  get heatmapData(): DashboardGeoStatsDtoHeatmapInner[] | null {
    return this._heatmapData;
  }

  private map: leaflet.Map | undefined;
  private heatmapLayer: leaflet.LayerGroup | undefined;

  constructor() {
    // Removed effect as we are using setter for reactivity
  }

  ngAfterViewInit() {
    this.initMap();
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

    this.heatmapLayer = leaflet.layerGroup().addTo(this.map);

    if (this.heatmapData) {
      this.updateHeatmap(this.heatmapData);
    }
  }

  private updateHeatmap(data: DashboardGeoStatsDtoHeatmapInner[]) {
    if (!this.map) return;

    // Remove existing heatmap layer if any
    if (this.heatmapLayer) {
      this.map.removeLayer(this.heatmapLayer);
    }

    const points: [number, number, number][] = [];
    let maxWeight = 0;

    data.forEach((point) => {
      const { lat, lng, weight } = point;
      const w = weight || 0;
      if (lat && lng) {
        if (w > maxWeight) maxWeight = w;
        points.push([lat, lng, w]);
      }
    });

    if (points.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.heatmapLayer = (leaflet as any).heatLayer(points, {
        radius: 25,
        blur: 15,
        maxZoom: 10,
        max: maxWeight > 0 ? maxWeight : 1.0,
        gradient: {
          0.4: 'blue',
          0.6: 'cyan',
          0.7: 'lime',
          0.8: 'yellow',
          1.0: 'red',
        },
      });

      this.heatmapLayer?.addTo(this.map);

      const group = new leaflet.FeatureGroup(
        points.map((p) => leaflet.marker([p[0], p[1]])), // Temp markers for bounds
      );
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }
}
