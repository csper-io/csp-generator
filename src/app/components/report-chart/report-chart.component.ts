import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { HTML5_FMT } from 'moment';

@Component({
  selector: 'app-report-chart',
  templateUrl: './report-chart.component.html',
  styleUrls: ['./report-chart.component.css']
})
export class ReportChartComponent implements OnInit {

  @Input() projectID: string
  @Input() policyID: string
  @Input() hash: string
  @Input() bucket: string
  @Input() directive: string
  @Input() limit: number
  @Input() page: number
  @Input() isGroup: boolean
  @Input() hideBucketButtons: boolean
  chartData: any
  chartLabels: string[]
  chartOptions: any

  constructor(
    private reportService: ReportService) {

    if (!this.projectID) {
      this.projectID = ""
    }
    if (!this.policyID) {
      this.policyID = ""
    }
    if (!this.hash) {
      this.hash = ""
    }
    if (!this.directive) {
      this.directive = ""
    }
    if (!this.bucket) {
      this.bucket = "hour"
    }
    if (!this.limit) {
      this.limit = 20
    }
    if (!this.limit) {
      this.limit = 20
    }
    this.page = 0


    this.chartData = []
    this.chartLabels = []
    this.chartOptions = {
      responsive: true,
      scales: {
        xAxes: [{}],
        yAxes: [
          {
            id: 'y-axis-0',
            position: 'right',
          },
        ]
      }
    };

  }

  ngOnInit() {
    // load data in ngOnChanges
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadData()
  }

  loadData() {
    this.reportService.getReportTimeseries(this.projectID, this.policyID, this.hash, true, this.bucket, this.directive).subscribe((t) => {
      this.chartData = []
      this.chartLabels = []

      this.chartLabels = t.labels
      for (let key in t.dataset) {
        this.chartData.push({ label: key, data: t.dataset[key] })
      }
    })
  }
}
