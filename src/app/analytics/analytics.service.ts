import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  baseurl = environment.baseUrl;
  constructor(private http: HttpClient) { }


  get_academic_years(): Observable<any> {
    let url = `${this.baseurl}academicyear`;
    return this.http.get(url);
  }

  get_term_details(): Observable<any> {
    let url = `${this.baseurl}termNumber`;
    return this.http.get(url)

  }

  get_attendance_details(usn:string,year:any,terms:any):Observable<any>{
    let url = `${this.baseurl}attendancedetails/${usn}/${year}/${terms}`
    return this.http.get(url)

  }
  get_offer_by_usn(term,usn):Observable<any>{
    let ur = `${this.baseurl}get-placement/${term}/${usn}`;
    return this.http.get(ur);
  }
  get_attendence_by_course(code,usn):Observable<any>{
    let ur = `${this.baseurl}get-attendence-for-course/${code}/${usn}`;
    return this.http.get(ur);
  }
  get_faculty_names(dept):Observable<any>{
    let ur = `${this.baseurl}get-faculty-by-dept/${dept}`;
    return this.http.get(ur);
  }
}
