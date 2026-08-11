import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MATERIAL_MODULES }
from '../../material/material';

import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    CommonModule,
    ...MATERIAL_MODULES
  ],
  templateUrl: './loading.html',
  styleUrl: './loading.scss'
})
export class Loading {

  readonly loading =
    inject(LoadingService);

}