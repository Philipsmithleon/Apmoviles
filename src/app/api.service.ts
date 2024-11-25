import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getIpAddress(): Observable<any> {
    return this.http.get('https://api.ipify.org?format=json').pipe(
      map(response => {
        this.storeIpAddress(response);
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        return of(this.getStoredIpAddress());
      })
    );
  }

  private storeIpAddress(response: any) {
    localStorage.setItem('cached_ip', JSON.stringify({
      ip: response.ip,
      timestamp: Date.now()
    }));
  }

  private getStoredIpAddress(): any {
    const storedIp = localStorage.getItem('cached_ip');
    
    if (storedIp) {
      return JSON.parse(storedIp);
    }
    
    return { ip: 'IP no disponible' };
  }
}