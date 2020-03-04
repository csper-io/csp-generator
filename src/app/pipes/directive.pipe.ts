import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'directive'
})
export class DirectivePipe implements PipeTransform {

  transform(reports: any[], directive: string): any[] {
    let out: any[] = []
    for (var i = 0; i < reports.length; i++) {

      if (reports[i].directive == directive) {
        out.push(reports[i])
      } else if (reports[i].effectiveDirective && reports[i].effectiveDirective.indexOf(directive) == 0) {
        out.push(reports[i])
      }
    }

    return out
  }
}
