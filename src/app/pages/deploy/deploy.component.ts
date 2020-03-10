import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Project, ProjectInvite } from 'src/app/models/project';
import { environment } from 'src/environments/environment';
import { forkJoin, noop } from 'rxjs';
import { PolicyService } from 'src/app/services/policy.service';
import { RecommendationService } from 'src/app/services/recommendation.service';
import { Policy } from 'src/app/models/policy';
import { BuilderRecommendations } from 'src/app/models/recommendations';
import { ExtensionService } from 'src/app/services/extension.service';
import { BuilderState } from 'src/app/models/builderstate';

@Component({
  selector: 'app-deploy',
  templateUrl: './deploy.component.html',
  styleUrls: ['./deploy.component.css']
})
export class DeployComponent implements OnInit {
  domain: string
  state: BuilderState

  projectID: string
  project: Project

  policyID: string
  policies: Policy[]

  recommendations: BuilderRecommendations

  endpointURL: string
  starterPolicy: string

  invite: ProjectInvite
  inviteLink: string

  emails: string
  isEmailsSent: boolean

  constructor(private projectService: ProjectService, private route: ActivatedRoute,
    private policyService: PolicyService, private recommendationService: RecommendationService,
    private extensionService: ExtensionService, private router: Router) {
    this.isEmailsSent = false
  }

  ngOnInit() {
    this.extensionService.getCurrentDomain().subscribe((domain) => {
      this.domain = domain

      this.extensionService.getStateByDomain(this.domain).subscribe((s) => {
        this.state = s
        this.projectID = this.state.projectID

        this.projectService.getProject(this.projectID).subscribe((p) => {
          this.project = p
        })

        this.setInactive()
        this.refreshRecommendations()
      })
    })
  }

  goToProject() {
    this.projectService.createInviteLink(this.projectID).subscribe((i) => {
      this.invite = i
      this.inviteLink = `${environment.origin}/join/${this.projectID}/${this.invite.token}`
      chrome.tabs.create({ url: this.inviteLink, active: true });
      return false;
    })
  }

  sendEmail() {
    this.isEmailsSent = false
    this.projectService.sendSummaryEmail(this.projectID, this.emails).subscribe(() => {
      this.isEmailsSent = true
    })
  }

  setInactive() {
    this.extensionService.getStateByDomain(this.domain).subscribe((state: BuilderState) => {
      state.isEnabled = !state.isEnabled

      this.extensionService.saveState(this.domain, state).subscribe(noop)
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

      this.policyID = this.policies[this.policies.length - 1].id
      this.recommendationService.getAllAcceptedBuilderRecommendations(this.projectID, this.policyID).subscribe((r) => {
        this.recommendations = r

        let policy: Policy = {
          policy: this.recommendations.recommendedPolicy, makePrimary: false, projectID: this.projectID
        } as Policy

        this.policyService.savePolicy(policy).subscribe((p) => { })
      })
    })
  }

  deleteProject() {
    this.extensionService.deleteState(this.state).subscribe(() => {
      this.router.navigate(["/wizard", "start"])
    })
  }
}
