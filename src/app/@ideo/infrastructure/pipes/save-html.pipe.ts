import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml' })
export class SafeHtml implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }

    transform(html: string, type: SecurityContext = 0) {
        switch (type) {
            case SecurityContext.NONE:
                return html
            case SecurityContext.HTML:
                return this.sanitizer.bypassSecurityTrustHtml(html)
            case SecurityContext.STYLE:
                return this.sanitizer.bypassSecurityTrustStyle(html)
            case SecurityContext.SCRIPT:
                return this.sanitizer.bypassSecurityTrustScript(html);
            case SecurityContext.URL:
                return this.sanitizer.bypassSecurityTrustUrl(html);
            case SecurityContext.RESOURCE_URL:
                return this.sanitizer.bypassSecurityTrustResourceUrl(html)
        }
    }
}