import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilityService } from './utility.service';
import { CompanyResponse } from 'src/model/company';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  apiUrl = environment.glueUpApiConfig.apiUrl;

  constructor(private http: HttpClient, private utilityService: UtilityService) { }

  loadMembers(bodyParam: any) {
    const body = {
      "projection": [],
      "filter": bodyParam.filter,
      "search": bodyParam.search,
      "order": {
        "name": "asc"
      },
      "fields": "name",
      "offset": bodyParam.offset,
      "limit": 0
    };
    const httpOptions = {
      headers: new HttpHeaders({
        'a': this.utilityService.getGlueUpApiHeaderValue('post')
      })
    };
    return this.http.post<CompanyResponse>(`${this.apiUrl}membershipDirectory/corporateMemberships`, body, httpOptions);
  }

}
