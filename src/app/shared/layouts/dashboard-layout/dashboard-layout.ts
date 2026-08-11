import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from '../../components/navbar/navbar';
import { Sidebar } from '../../components/sidebar/sidebar';
import { Footer } from '../../components/footer/footer';

@Component({
    selector: 'app-dashboard-layout',
    standalone: true,

    imports: [
        RouterOutlet,
        Navbar,
        Sidebar,
        Footer
    ],

    templateUrl: './dashboard-layout.html',
    styleUrl: './dashboard-layout.scss'
})
export class DashboardLayout {
}