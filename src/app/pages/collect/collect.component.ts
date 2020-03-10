import { Component, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { PolicyService } from 'src/app/services/policy.service';
import { Policy } from 'src/app/models/policy';
import { Overview } from 'src/app/models/overview';
import { isNullID } from 'src/app/utils/utils';
import { forkJoin } from 'rxjs';
import { Recommendations, BuilderRecommendations } from 'src/app/models/recommendations';
import { RecommendationService } from 'src/app/services/recommendation.service';
import { ExtensionService } from 'src/app/services/extension.service';
import { BuilderState } from 'src/app/models/builderstate';

@Component({
  selector: 'app-collect',
  templateUrl: './collect.component.html',
  styleUrls: ['./collect.component.css']
})
export class CollectComponent implements OnInit {
  domain: string

  projectID: string
  policyID: string

  project: Project
  policies: Policy[]

  endpointURL: string
  starterPolicy: string

  state: BuilderState

  overview: Overview
  recommendations: BuilderRecommendations

  lastPolicy: Policy

  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private policyService: PolicyService, private recommendationService: RecommendationService,
    private extensionService: ExtensionService) {
    this.overview = {
      totalReports: 0
    } as Overview
  }

  ngOnInit() {
    this.extensionService.getCurrentDomain().subscribe((domain) => {
      this.domain = domain

      this.extensionService.getStateByDomain(this.domain).subscribe((s) => {
        this.state = s
        this.projectID = this.state.projectID

        this.projectService.getProjectOverview(this.projectID).subscribe((o) => {
          if (this.overview.totalReports > 0) {
            let t = this.overview.totalReports
            this.overview = o
            this.overview.totalReports += t
          } else {
            this.overview = o
          }

          if (this.overview.totalReports == 0) {
            this.extensionService.refreshPage()
          }
        })

        this.refreshRecommendations()
      })
    })
  }

  refreshRecommendations() {
    forkJoin(this.projectService.getProject(this.projectID), this.policyService.getPolicies(this.projectID)).subscribe(([project, policies]) => {
      this.project = project;
      this.policies = policies;

      if (!this.policies || this.policies.length == 0) {
        this.starterPolicy = `default-src 'self'; script-src 'self' 'report-sample'; style-src 'self' 'report-sample'; base-uri 'self'; form-action 'self'; object-src 'none';`
        return
      }

      console.log(this.policies)
      this.policyID = this.policies[this.policies.length - 1].id
      this.recommendationService.getAllAcceptedBuilderRecommendations(this.projectID, this.policyID).subscribe((r) => {
        this.recommendations = r
      })
    })
  }

  deleteState() {
    this.extensionService.deleteState(this.state)
  }
}
