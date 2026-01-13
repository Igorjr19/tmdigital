import { ApiProperty } from '@nestjs/swagger';
import { LeadDto } from './lead.dto';

export class DashboardStaleLeadDto extends LeadDto {}

export class DashboardPlantingAlertDto {
  @ApiProperty({
    description: 'The name of the culture/crop (e.g., Soja, Milho).',
    example: 'Soja',
  })
  culture: string;

  @ApiProperty({
    description: 'List of month numbers (1-12) suitable for planting.',
    example: [10, 11, 12],
    type: [Number],
  })
  plantingMonths: number[];

  @ApiProperty({
    description: 'Human-readable alert message about the planting window.',
    example: 'Janela de plantio para Soja está aberta!',
  })
  alertMessage: string;
}

export class KeyValueDto {
  @ApiProperty({
    description: 'Label for the chart segment.',
    example: 'Bayer',
  })
  label: string;

  @ApiProperty({ description: 'Value for the chart segment.', example: 45.5 })
  value: number;
}

export class DashboardGeoStatsDto {
  @ApiProperty({
    description: 'Total productive area (in hectares) of all rural properties.',
    example: 15000.5,
  })
  totalAreaRegistered: number;

  @ApiProperty({
    description:
      'Total productive area (in hectares) of properties linked to CONVERTED leads.',
    example: 5000.0,
  })
  totalAreaConverted: number;

  @ApiProperty({
    description:
      'Percentage of area converted vs total area registered (0-100).',
    example: 33.33,
  })
  penetrationPercentage: number;

  @ApiProperty({
    description: 'Heatmap data points representing lead potential by location.',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        lat: { type: 'number', example: -15.7801 },
        lng: { type: 'number', example: -47.9292 },
        weight: { type: 'number', example: 100000 },
      },
    },
    example: [{ lat: -15.7801, lng: -47.9292, weight: 100000 }],
  })
  heatmap: { lat: number; lng: number; weight: number }[];
}

export class DashboardMarketShareDto {
  @ApiProperty({
    description: 'Name of the current input supplier.',
    example: 'Bayer',
  })
  supplier: string;

  @ApiProperty({
    description: 'Percentage of market share for this supplier (0-100).',
    example: 25.5,
  })
  sharePercentage: number;

  @ApiProperty({
    description: 'Count of leads associated with this supplier.',
    example: 42,
  })
  count: number;
}

export class DashboardForecastDto {
  @ApiProperty({
    description:
      'Total estimated potential value of all active leads (raw sum).',
    example: 1000000,
  })
  totalPotential: number;

  @ApiProperty({
    description:
      'Weighted revenue forecast based on lead probability (Status).',
    example: 650000,
  })
  weightedForecast: number;
}
