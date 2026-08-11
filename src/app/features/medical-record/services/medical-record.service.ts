import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  ApiResponse
} from '../../../core/models/api-response';

import {
  MedicalRecord
} from '../models/medical-record';

import {
  CreateMedicalRecord
} from '../models/create-medical-record';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {

  private readonly http =
    inject(HttpClient);

  private readonly apiUrl =
    'https://localhost:7294/api/v1/MedicalRecord';


  getAll():
    Observable<ApiResponse<MedicalRecord[]>> {

    return this.http.get<
      ApiResponse<MedicalRecord[]>
    >(this.apiUrl);

  }


  getById(
    id: number
  ):
    Observable<ApiResponse<MedicalRecord>> {

    return this.http.get<
      ApiResponse<MedicalRecord>
    >(`${this.apiUrl}/${id}`);

  }


  create(
    model: CreateMedicalRecord
  ):
    Observable<ApiResponse<number>> {

    return this.http.post<
      ApiResponse<number>
    >(
      this.apiUrl,
      model
    );

  }


  update(
    id: number,
    model: CreateMedicalRecord
  ):
    Observable<ApiResponse<boolean>> {

    return this.http.put<
      ApiResponse<boolean>
    >(
      `${this.apiUrl}/${id}`,
      {
        id,
        diagnosis: model.diagnosis,
        symptoms: model.symptoms,
        clinicalNotes:
          model.clinicalNotes,
        treatmentPlan:
          model.treatmentPlan,
        followUpInstructions:
          model.followUpInstructions
      }
    );

  }


  delete(
    id: number
  ):
    Observable<ApiResponse<boolean>> {

    return this.http.delete<
      ApiResponse<boolean>
    >(
      `${this.apiUrl}/${id}`
    );

  }

}