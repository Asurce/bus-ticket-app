import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ShellComponent} from "./shared/components/shell/shell.component";
import {MAT_DATE_LOCALE} from "@angular/material/core";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ShellComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'hu-HU'}
  ]
})
export class AppComponent {
}
