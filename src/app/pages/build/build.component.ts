import { Component, OnInit } from '@angular/core';
import { Policy } from 'src/app/models/policy';
import { Project } from 'src/app/models/project';
import { BuilderRecommendations } from 'src/app/models/recommendations';
import { PolicyService } from 'src/app/services/policy.service';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute } from '@angular/router';
import { RecommendationService } from 'src/app/services/recommendation.service';
import { forkJoin } from 'rxjs';
import { isNullID } from 'src/app/utils/utils';

@Component({
  selector: 'app-build',
  templateUrl: './build.component.html',
  styleUrls: ['./build.component.css']
})
export class BuildComponent implements OnInit {
  policies: Policy[]
  projectID: string
  policyID: string
  project: Project

  currentPolicy: Policy
  savedPolicy: Policy

  recommendations: BuilderRecommendations
  highlights: string[]

  directives: string[]

  showAccepted: boolean
  showIgnored: boolean

  progress: any
  totalComplete: any

  errorStr: string

  starterPolicy: string

  constructor(private recommendationService: RecommendationService,
    private policyService: PolicyService,
    private projectService: ProjectService,
    private route: ActivatedRoute) {

    this.directives = policyService.directives

    this.showAccepted = false
    this.showIgnored = false
    this.progress = {}
  }

  ngOnInit() {
    this.projectID = this.route.snapshot.paramMap.get('projectID')

    // forkJoin(this.projectService.getProject(this.projectID), this.policyService.getPolicies(this.projectID)).subscribe(([project, policies]) => {
    //   this.project = project;
    //   this.policies = policies;

    //   if (!this.policies || this.policies.length == 0) {
    //     this.starterPolicy = `default-src 'self'; script-src 'self' 'report-sample'; style-src 'self' 'report-sample'; base-uri 'self'; form-action 'self'; object-src 'none';`
    //     return
    //   }

    //   this.policyID = this.policies[this.policies.length - 1].id

    //   this.recommendationService.getBuilderRecommendations(this.projectID, this.policyID).subscribe((r) => {
    //     this.recommendations = r

    //     for (let i = 0; i < this.recommendations.recommendations.length; i++) {
    //       this.recommendations.recommendations[i].isAccepted = true
    //     }

    //     this.recommendationService.applyBuilderRecommendations(this.recommendations).subscribe((r) => {
    //       this.recommendations = r
    //     })
    //   })
    // })
  }
}