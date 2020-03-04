import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute } from '@angular/router';
import { Project, ProjectInvite } from 'src/app/models/project';
import { environment } from 'src/environments/environment';
import { forkJoin } from 'rxjs';
import { PolicyService } from 'src/app/services/policy.service';
import { RecommendationService } from 'src/app/services/recommendation.service';
import { Policy } from 'src/app/models/policy';
import { BuilderRecommendations } from 'src/app/models/recommendations';

@Component({
  selector: 'app-next',
  templateUrl: './next.component.html',
  styleUrls: ['./next.component.css']
})
export class NextComponent implements OnInit {
  projectID: string
  project: Project

  policyID: string
  policies: Policy[]

  recommendations: BuilderRecommendations

  endpointURL: string
  starterPolicy: string

  invite: ProjectInvite
  inviteLink: string

  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private policyService: PolicyService, private recommendationService: RecommendationService) {
  }

  ngOnInit() {
    this.projectID = this.route.snapshot.paramMap.get("projectID")

    this.projectService.getProject(this.projectID).subscribe((p) => {
      this.project = p
    })

    this.refreshRecommendations()
  }

  goToProject() {
    this.projectService.createInviteLink(this.projectID).subscribe((i) => {
      this.invite = i
      this.inviteLink = `${environment.origin}/join/${this.projectID}/${this.invite.token}`
      window.location.assign("http://localhost:4200" + this.inviteLink)
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

}
