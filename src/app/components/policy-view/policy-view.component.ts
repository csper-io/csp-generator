import { Component, Input, OnInit, ChangeDetectionStrategy, SimpleChange, SimpleChanges } from '@angular/core';
import { ParsedPolicy } from 'src/app/models/recommendations';
import { stringify } from 'querystring';
import { PolicyService } from 'src/app/services/policy.service';

@Component({
  selector: 'app-policy-view',
  templateUrl: './policy-view.component.html',
  styleUrls: ['./policy-view.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PolicyViewComponent implements OnInit {
  @Input('policyStr') inPolicyStr: string
  @Input('parsedPolicy') inParsedPolicy: ParsedPolicy
  @Input('mode') inMode: string

  @Input('directive') inDirective: string
  @Input('highlights') inHighlights: string

  parsedPolicy: ParsedPolicy
  policyStr: string
  displayMode: string

  constructor(private policyService: PolicyService) {
    this.displayMode = "pretty"
  }

  ngOnInit() {
    if (this.inMode) {
      this.displayMode = this.inMode
    }

    if (this.inParsedPolicy) {
      this.policyStr = this.inParsedPolicy.policy
      this.parsedPolicy = Object.assign({}, this.inParsedPolicy)

      this.parsedPolicy.sourceMapping = new Map()
      for (var i in this.inParsedPolicy.sourceMapping) {
        this.parsedPolicy.sourceMapping[i] = this.inParsedPolicy.sourceMapping[i];
      }
    } else {
      this.policyService.parsePolicy(this.inPolicyStr).subscribe((p) => {
        this.parsedPolicy = p
        this.policyStr = this.inPolicyStr
      })
      return
    }

    if (this.inDirective) {
      this.parsedPolicy.directiveOrder = [this.inDirective]
    }

    if (this.inHighlights) {
      // this.parsedPolicy.sourceMapping = new Map<string, string>();
      for (let i = 0; i < this.inHighlights.length; i++) {
        this.parsedPolicy.sourceMapping[this.inHighlights[i]] = "highlight"
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit()
  }
}
