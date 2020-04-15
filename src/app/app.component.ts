import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ExtensionService } from './services/extension.service';
import { BuilderState } from './models/builderstate';
import { BuilderRecommendations } from './models/recommendations';
import { noop } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CSP Generator';

  isScrolled: boolean
  domain: string
  isActive: boolean
  isKnownDomain: boolean

  constructor(private router: Router, private extensionService: ExtensionService) {

  }

  ngOnInit() {

    this.extensionService.getCurrentDomain().subscribe((d) => {
      this.domain = d;
      this.checkIfActive()

      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.checkIfActive()
        }
      })
    })


  }

  checkIfActive() {
    this.extensionService.getStateByDomain(this.domain).subscribe((state: BuilderState) => {
      this.isActive = state.isEnabled
      this.isKnownDomain = true
    }, () => {
      this.isKnownDomain = false
    })

  }

  toggle() {
    this.extensionService.getStateByDomain(this.domain).subscribe((state: BuilderState) => {
      state.isEnabled = !state.isEnabled
      this.isActive = state.isEnabled

      this.extensionService.saveState(this.domain, state).subscribe(noop)
    })
  }

  @HostListener("window:scroll", [])
  onWindowScroll() {
    const number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (number >= 20) {
      this.isScrolled = true
    } else {
      this.isScrolled = false
    }
  }
}
