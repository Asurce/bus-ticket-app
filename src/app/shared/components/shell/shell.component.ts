import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {MatAnchor, MatIconButton} from "@angular/material/button";
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from "@angular/router";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {filter, map, Observable, shareReplay} from "rxjs";
import {CommonModule, NgOptimizedImage} from "@angular/common";
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
export class ShellComponent implements OnInit, AfterViewInit {

  isLoggedIn = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(map(result => result.matches), shareReplay());

  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  constructor(
    private breakpointObserver: BreakpointObserver,
    protected router: Router,
    protected authService: AuthService,
    private elementRef: ElementRef,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.authService.currentUser().subscribe(user => this.isLoggedIn = !!user);

    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(value => {
      const rootStyle = this.elementRef.nativeElement.ownerDocument.documentElement.style;

      if (value.matches) {
        rootStyle.setProperty('--login-width', '90%');
        rootStyle.setProperty('--limit-width', '90%');
      } else {
        rootStyle.setProperty('--login-width', '30%');
        rootStyle.setProperty('--limit-width', '70%');
      }
    })

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.router.routerState.snapshot))
      .subscribe(url => {
        const sidenavContent = document.getElementById('content');

        console.log(url)

        switch(url.url) {
          case ('/'): {
            sidenavContent!.style.backgroundImage = 'url(assets/bg.jpg)';
            break;
          }
          default: {
            sidenavContent!.style.backgroundImage = 'unset';
            break;
          }
        }
      })
  }

  ngAfterViewInit() {
    this.isHandset$.subscribe(value => value ? '' : this.sidenav.close())
  }

  logout() {
    this.authService.logout().then();
  }
}
