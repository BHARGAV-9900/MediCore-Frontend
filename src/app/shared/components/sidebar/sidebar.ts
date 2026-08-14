import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { AuthenticationService }
  from '../../../features/authentication/services/authentication.service';

import { SidebarItem }
  from './sidebar-item';

import { SIDEBAR_ITEMS } from './sidebar.data';


@Component({
  selector: 'app-sidebar',

  standalone: true,

  imports: [
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './sidebar.html',

  styleUrl: './sidebar.scss'
})
export class Sidebar implements OnInit {

  private readonly authService =
    inject(AuthenticationService);


  menuItems: SidebarItem[] = [];


  ngOnInit(): void {

    this.authService.currentUser$
      .subscribe(user => {

        console.log('CURRENT USER:', user);
        console.log('CURRENT ROLE:', user?.role);

        if (!user) {

          this.menuItems = [];

          return;

        }


        const role =
          user.role.trim().toLowerCase();


        this.menuItems =
          SIDEBAR_ITEMS.filter(item => {

            if (!item.roles ||
                item.roles.length === 0) {

              return true;

            }


            return item.roles.some(
              allowedRole =>
                allowedRole.toLowerCase() === role
            );

          });

      });

  }

}