import { Component, OnInit } from '@angular/core';
import { Policy } from 'src/app/models/policy';
import { Project } from 'src/app/models/project';
import { Report } from 'src/app/models/report';
import { ReportService } from 'src/app/services/report.service';
import { PolicyService } from 'src/app/services/policy.service';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { isNullID } from 'src/app/utils/utils';
import { ExtensionService } from 'src/app/services/extension.service';
import { BuilderState } from 'src/app/models/builderstate';

@Component({
  selector: 'app-inline',
  templateUrl: './inline.component.html',
  styleUrls: ['./inline.component.css']
})
export class InlineComponent implements OnInit {

  domain: string
  builderState: BuilderState

  policies: Policy[]
  projectID: string
  policyID: string
  project: Project

  currentPolicy: Policy

  reports: Report[]

  directives: string[]

  showCompleted: boolean

  progress: any
  totalComplete: any
  loaded: boolean

  constructor(private reportService: ReportService,
    private policyService: PolicyService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private extensionService: ExtensionService) {

    this.directives = policyService.directives
    this.reports = []
    this.progress = {}
    this.loaded = false
  }

  ngOnInit() {
    this.extensionService.getCurrentDomain().subscribe((d) => {
      this.domain = d;

      this.extensionService.getStateByDomain(this.domain).subscribe((s) => {
        this.builderState = s;
        this.projectID = this.builderState.projectID

        forkJoin(this.projectService.getProject(this.projectID), this.policyService.getPolicies(this.projectID)).subscribe(([project, policies]) => {
          this.project = project;
          this.policies = policies;

          this.policyID = this.project.primaryPolicy

          this.loadReports()
        })
      })
    })
  }

  loadReports() {
    this.reportService.getReportsFiltered(this.projectID, this.policyID, "", true, "", "", -1, -1).subscribe((reports) => {
      this.reports = [];
      for (let i = 0; i < reports.length; i++) {
        let report = reports[i];

        if (report.blockedURI == "" || report.blockedURI == "inline") {
          this.reports.push(report)
        }
      }
      this.reports.sort((a, b: Report): number => {
        if (a.documentURI > b.documentURI) {
          return 1
        } else {
          return -1
        }
      })
      this.loaded = true
    })
  }

}
