import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ReportService } from 'src/app/services/report.service';
import { Report } from 'src/app/models/report';
import { Project } from 'src/app/models/project';
import { Policy } from 'src/app/models/policy';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { PolicyService } from 'src/app/services/policy.service';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { Timeseries } from 'src/app/models/timeseries';


interface ChartData {
  label: string
  data: number[]
}

@Component({
  selector: 'app-realtime-chart',
  templateUrl: './realtime-chart.component.html',
  styleUrls: ['./realtime-chart.component.css']
})
export class RealtimeChartComponent implements OnInit {
  @Input("projectID") projectID: string

  @Output("newReport") newReport = new EventEmitter<Report>();

  reports: Report[]
  project: Project
  policies: Policy[]

  totalReports: number
  reportsThisSecond: Report[]

  realtimeChartData: ChartData[]
  realtimeChartLabels: string[]
  realtimeChartOptions: any

  cutoff: number

  periods: string

  constructor(private reportService: ReportService, private route: ActivatedRoute,
    private projectService: ProjectService,
    private policyService: PolicyService,
  ) {

    this.reports = []
    this.totalReports = 0
    this.reportsThisSecond = []
    this.cutoff = 20
    this.realtimeChartLabels = []
    this.realtimeChartData = [
      this.emptyDataSeries("Reports", 0)
    ];

    for (var i = 0; i < this.cutoff; i++) {
      this.realtimeChartLabels.unshift(`${i + 1}s ago`)
      // this.realtimeChartData[0].data.push(0)
    }

    this.realtimeChartOptions = {
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

  ngOnDestroy() {
    this.reportService.closeReportWS();
  }

  ngOnInit() {
    this.projectService.getProject(this.projectID).subscribe((p) => { this.project = p })

    this.reportService.getReportTimeseries(this.projectID, "", "", false, "second", "").subscribe((timeseries: Timeseries) => {
      console.log(timeseries)
      for (let k of Object.keys(timeseries.dataset)) {
        this.realtimeChartData.push({
          label: k,
          data: timeseries.dataset[k].slice(timeseries.dataset[k].length - this.cutoff, timeseries.dataset[k].length)
        })
      }
    })

    this.reportService.getReportsWS(this.projectID).subscribe((report) => {
      this.newReport.next(report)
      this.reportsThisSecond.push(report)
      for (let i = 0; i < this.reports.length; i++) {
        if (report.hash == this.reports[i].hash) {
          this.reports[i].count += 1
          return
        }
      }
      this.reports.push(report)
    })

    this.policyService.getPolicies(this.projectID).subscribe((p) => {
      this.policies = p;
    })

    timer(0, 1000).pipe(
      take(1000)).subscribe(x => {

        // normalize and add
        for (let i = 0; i < this.realtimeChartData.length; i++) {
          for (let index = 0; index < this.realtimeChartData[i].data.length - 1; index++) {
            this.realtimeChartData[i].data[index] = this.realtimeChartData[i].data[index + 1]
          }
          this.realtimeChartData[i].data[this.realtimeChartData[i].data.length - 1] = 0
        }

        // add new reports
        for (let report of this.reportsThisSecond) {
          let isKnownDirective = false

          for (let i = 0; i < this.realtimeChartData.length; i++) {
            if (report.effectiveDirective == this.realtimeChartData[i].label) {
              let lastIndex = this.realtimeChartData[i].data.length - 1
              this.realtimeChartData[i].data[lastIndex]++
              isKnownDirective = true
            }
          }
          if (!isKnownDirective) {
            this.realtimeChartData.push(this.emptyDataSeries(report.effectiveDirective, 1))
          }
        }
        this.reportsThisSecond = []
        this.realtimeChartData = this.realtimeChartData.slice()

        // this.realtimeChartData = this.realtimeChartData.slice()
      })
  }

  emptyDataSeries(label: string, last: number): ChartData {
    let data = { label: label, data: [] }
    for (var i = 0; i < this.cutoff - 1; i++) {
      data.data.push(0)
    }
    data.data.push(last)
    return data
  }
}
