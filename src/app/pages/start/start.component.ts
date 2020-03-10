import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { APIToken } from 'src/app/models/apitoken';
import { Router } from '@angular/router';
import { PolicyService } from 'src/app/services/policy.service';
import { Policy } from 'src/app/models/policy';
import { environment } from 'src/environments/environment';
import { ExtensionService } from 'src/app/services/extension.service';
import { noop } from 'rxjs';
import { BuilderState } from 'src/app/models/builderstate';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  token: APIToken
  domain: string

  constructor(private projectService: ProjectService,
    private extensionService: ExtensionService,
    private router: Router,
    private policyService: PolicyService,
    public zone: NgZone
  ) {
  }

  ngOnInit() {
    this.extensionService.getCurrentDomain().subscribe((d) => {
      this.domain = d
    })
  }

  newProject() {
    this.projectService.newTempProject(this.domain).subscribe((token) => {
      this.token = token
      var newBuilderState = token as unknown as BuilderState
      let endpointURL = `https://${this.token.projectID}.endpoint.${environment.origin.replace("https://", "")}`
      let starterPolicy = "default-src 'self'; script-src 'self' 'report-sample'; style-src 'self' 'report-sample'; base-uri 'self'; object-src 'none'; report-uri " + endpointURL + ";"

      newBuilderState.isEnabled = true
      newBuilderState.policy = starterPolicy
      newBuilderState.domain = this.domain

      this.extensionService.saveState(this.domain, newBuilderState).subscribe(() => {
        this.token = token
        this.projectService.getProject(this.token.projectID).subscribe((p) => {

          let policy: Policy = {
            policy: starterPolicy, makePrimary: true, projectID: this.token.projectID
          } as Policy

          this.policyService.savePolicy(policy).subscribe((p) => {
            this.router.navigate(["/wizard", "collect"])
          })
        })
      })
    })
  }
}
