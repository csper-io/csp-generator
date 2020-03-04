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

@Component({
  selector: 'app-collect',
  templateUrl: './collect.component.html',
  styleUrls: ['./collect.component.css']
})
export class CollectComponent implements OnInit {

  projectID: string
  policyID: string

  project: Project
  policies: Policy[]

  endpointURL: string
  starterPolicy: string

  overview: Overview
  recommendations: BuilderRecommendations

  lastPolicy: Policy

  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private policyService: PolicyService, private recommendationService: RecommendationService) {
    this.overview = {
      totalReports: 0
    } as Overview
  }

  ngOnInit() {
    this.projectID = this.route.snapshot.paramMap.get("projectID")

    this.projectService.getProjectOverview(this.projectID).subscribe((o) => {
      if (this.overview.totalReports > 0) {
        let t = this.overview.totalReports
        this.overview = o
        this.overview.totalReports += t
      } else {
        this.overview = o
      }
    })

    this.refreshRecommendations()
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
}
