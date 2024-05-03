import {Component, ElementRef, inject, OnInit} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {MatAnchor, MatIconButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {BehaviorSubject, map, Observable, shareReplay} from "rxjs";
import {AsyncPipe, CommonModule, NgOptimizedImage} from "@angular/common";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavContainer,
    MatSidenavContent,
    MatToolbar,
    MatAnchor,
    RouterLink,
    MatSidenav,
    MatNavList,
    MatListItem,
    MatIconButton,
    MatIcon,
    NgOptimizedImage
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent implements OnInit {

  isLoggedIn = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(map(result => result.matches), shareReplay());

  constructor(
    private breakpointObserver: BreakpointObserver,
    protected router: Router,
    protected authService: AuthService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.authService.currentUser().subscribe(user => this.isLoggedIn = !!user);

    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(value => {
      const breakpoint = value.breakpoints;
      const rootStyle = this.elementRef.nativeElement.ownerDocument.documentElement.style;

      if (value.matches) {
        rootStyle.setProperty('--login-width', '90%');
        rootStyle.setProperty('--limit-width', '90%');
      } else {
        rootStyle.setProperty('--login-width', '30%');
        rootStyle.setProperty('--limit-width', '70%');
      }
    })
  }

  logout() {
    this.authService.logout().then();
  }
}
