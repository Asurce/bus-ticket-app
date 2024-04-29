import {Component, inject} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatToolbar} from "@angular/material/toolbar";
import {MatAnchor, MatIconButton} from "@angular/material/button";
import {Router, RouterLink} from "@angular/router";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {map, Observable, shareReplay} from "rxjs";
import {AsyncPipe, CommonModule, NgOptimizedImage} from "@angular/common";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";

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
  styleUrl: './shell.component.scss'
})
export class ShellComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(map(result => result.matches), shareReplay());

  constructor(
    private breakpointObserver: BreakpointObserver,
    protected router: Router
  ) {}

  protected readonly isFinite = isFinite;
}
