import { Component, Input, input, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export type IconName = 
  | 'arrow-left'
  | 'user'
  | 'phone'
  | 'map-pin'
  | 'edit'
  | 'dollar-sign'
  | 'calendar'
  | 'plus'
  | 'save'
  | 'x'
  | 'file-text'
  | 'file'
  | 'minus'
  | 'share'
  | 'log-out'
  | 'book'
  | 'users'
  | 'search'
  | 'lock'
  | 'alert-circle'
  | 'info'
  | 'user-plus'
  | 'chevron-left'
  | 'chevron-right'
  | 'loading';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      [class]="'inline-flex items-center justify-center ' + class()"
      [style.width]="size() + 'px'"
      [style.height]="size() + 'px'"
      [innerHTML]="svgContent()"
    ></span>
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    ::ng-deep svg {
      width: 100%;
      height: 100%;
    }
  `]
})
export class IconComponent implements OnInit {
  name = input.required<IconName>();
  size = input<number>(20);
  class = input<string>('');
  
  svgContent = signal<SafeHtml>('');

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadIcon();
  }

  private loadIcon() {
    const iconPath = `/assets/icons/${this.name()}.svg`;
    this.http.get(iconPath, { responseType: 'text' }).subscribe({
      next: (svg) => {
        this.svgContent.set(this.sanitizer.bypassSecurityTrustHtml(svg));
      },
      error: (err) => {
        console.error(`Failed to load icon: ${this.name()}`, err);
      }
    });
  }
}
