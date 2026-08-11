import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.scss'
})
export class StatCard {

  title = input('');

  value = input('');

  icon = input('');

  color = input('#1976d2');

}