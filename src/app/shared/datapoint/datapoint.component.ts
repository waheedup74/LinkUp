import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ChartModule,
} from '@smart-webcomponents-angular/chart';

@Component({
  selector: 'datapoint',
  templateUrl: './datapoint.component.html',
  standalone: true,
  styleUrls: ['./datapoint.component.scss'],
  imports: [ChartModule, CommonModule],
})
export class DatapointComponent implements OnChanges {
  @Input() config!: any;

  @ViewChild('chart', { read: ChartComponent, static: false })
  chart!: ChartComponent;
  public sampleData: Array<any> = [];
  public seriesGroups: Array<any> = [];

  caption = 'Monthly Average Temperature';
  showLegend = true;
  padding = { left: 30, top: 5, right: 30, bottom: 5 };
  titlePadding = { left: 50, top: 0, right: 0, bottom: 10 };
  colorScheme = 'scheme32';
  xAxis = {
    dataField: 'Month',
    tickMarks: {
      visible: true,
      unitInterval: 1,
      color: '#BCBCBC',
    },
    gridLines: {
      visible: true,
      unitInterval: 3,
      color: '#BCBCBC',
    },
  };
  clip = false;

  ngOnChanges() {
    if (this.config.content_type.type === 'line') {
      this.sampleData = [
        { Month: 'Jan', Varna: 6, Moscow: -5, Cairo: 19 },
        { Month: 'Feb', Varna: 8, Moscow: -4, Cairo: 21 },
        { Month: 'Mar', Varna: 11, Moscow: 2, Cairo: 24 },
        { Month: 'Apr', Varna: 16, Moscow: 11, Cairo: 29 },
        { Month: 'May', Varna: 21, Moscow: 19, Cairo: 33 },
        { Month: 'Jun', Varna: 26, Moscow: 22, Cairo: 35 },
        { Month: 'Jul', Varna: 28, Moscow: 24, Cairo: 35 },
        { Month: 'Aug', Varna: 29, Moscow: 22, Cairo: 35 },
        { Month: 'Sep', Varna: 24, Moscow: 16, Cairo: 34 },
        { Month: 'Oct', Varna: 19, Moscow: 8, Cairo: 30 },
        { Month: 'Nov', Varna: 13, Moscow: 1, Cairo: 25 },
        { Month: 'Dec', Varna: 8, Moscow: -3, Cairo: 21 },
      ];

      this.seriesGroups = [
        {
          type: 'line',
          series: [
            {
              dataField: 'Varna',
              displayText: 'Varna',
              labels: { visible: true, formatSettings: { sufix: '°' } },
              symbolType: 'circle',
              symbolSize: 8,
            },
            {
              dataField: 'Moscow',
              displayText: 'Moscow',
              labels: { visible: true, formatSettings: { sufix: '°' } },
              symbolType: 'diamond',
              symbolSize: 10,
            },
            {
              dataField: 'Cairo',
              displayText: 'Cairo',
              labels: { visible: true, formatSettings: { sufix: '°' } },
              symbolType: 'square',
              symbolSize: 8,
            },
          ],
        },
      ];
    }

    if (this.config.content_type.type === 'column') {
      this.sampleData = [
        {
          Continent: 'Asia',
          0: 1426.279708,
          1: 1338.558742,
          2: 263.564697,
          Countries: ['China', 'India', 'Indonesia'],
        },
        {
          Continent: 'N. America',
          0: 327.527107,
          1: 129.13215,
          2: 36.436169,
          Countries: ['United States', 'Mexico', 'Canada'],
        },
        {
          Continent: 'S. America',
          0: 210.193253,
          1: 49.265468,
          2: 44.139544,
          Countries: ['Brazil', 'Colombia', 'Argentina'],
        },
        {
          Continent: 'Africa',
          0: 185.31391,
          1: 102.675041,
          2: 96.325988,
          Countries: ['Nigeria', 'Ethiopia', 'Egypt'],
        },
        {
          Continent: 'Europe',
          0: 144.154086,
          1: 81.845984,
          2: 80.091763,
          Countries: ['Russia', 'Germany', 'Turkey'],
        },
      ];

      this.seriesGroups = [
        {
          type: 'column',
          orientation: 'horizontal',
          columnsGapPercent: 50,
          seriesGapPercent: 20,
          useGradientColors: false,
          valueAxis: {
            unitInterval: 100,
            minValue: 0,
            maxValue: 1600,
            flip: true,
            axisSize: 'auto',
          },
          toolTipFormatFunction: (
            value: number,
            itemIndex: number,
            series: { dataField: string; displayText: string }
          ) => {
            return `#${parseFloat(series.dataField) + 1} in ${this.sampleData[itemIndex].Continent
              }: ${this.sampleData[itemIndex].Countries[series.dataField]}
<br />Population: ${Math.round(value * 10e6)}`;
          },
          series: [
            { dataField: '0', displayText: 'First' },
            { dataField: '1', displayText: 'Second' },
            { dataField: '2', displayText: 'Third' },
          ],
        },
      ];
    }
  }
}
