import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import 'rxjs/add/operator/toPromise';
import { Observable, throwError } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})

export class JobsService {
    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getJobsList(): Promise<any> {
        let url:string = `${this.apiUrl}/jobscheduler/get_jobs_requested/`;
        return this.http.get(url).toPromise();
    }

    deleteJob(jobId): Promise<any> {
        let url:string = `${this.apiUrl}/jobscheduler/delete_job/${jobId}/`;
        return this.http.delete(url, {headers: new HttpHeaders({'Content-Type':'application/json'}), responseType:'text'}).toPromise();
    }

    pauseJob(jobId, isPaused): Promise<any> {
        let url:string = `${this.apiUrl}/jobscheduler/pause_play_job/${jobId}/${isPaused}/`;
        return this.http.put(url, {}).toPromise();
    }

    addJob(formData): Promise<any> {
        let url:string = `${this.apiUrl}/jobscheduler/create_job/`;
        return this.http.post(url, formData, {responseType:'text'}).toPromise();
    }
}
