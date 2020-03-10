import { Component, OnInit, NgZone } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { ExtensionService } from 'src/app/services/extension.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.css']
})
export class WizardComponent implements OnInit {

  step: string
  domain: string
  isKnownDomain: boolean

  constructor(private router: Router, private extensionService: ExtensionService, private zone: NgZone) {
    this.step = "start"
    this.isKnownDomain = false
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (!!event.url && event.url.match(/^\/wizard/)) {
          this.step = event.url.replace("/wizard/", "")
        }

        if (this.domain && this.domain.length > 0) {
          this.extensionService.getStateByDomain(this.domain).subscribe((token) => {
            this.isKnownDomain = true
          })
        }
      }
    })

    this.extensionService.getCurrentDomain().subscribe((domain) => {
      this.domain = domain

      console.log("wizard.component.ts: looking for existing")
      this.extensionService.getStateByDomain(domain).subscribe((token) => {
        this.isKnownDomain = true

        console.log("wizard.component.ts: found existing", token)
        this.router.navigate(["/wizard", "collect"])
      }, () => {
        console.log("wizard.component.ts: no existing")
      })
    })
  }
}
