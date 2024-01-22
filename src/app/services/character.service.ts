import { CommonFunctions } from '../helper/common.function';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Filter } from '../helper/filter';
import { ReportFilter } from '../helper/resultsFilter';
const CONTROLLER_NAME = '/characters';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(private http: HttpClient) {}
  getCharacters(filter: Filter): Observable<any> {
    filter = filter == null ? new Filter('', 1, 1, 1) : filter;
    return this.http.get(CommonFunctions.API_URL + CONTROLLER_NAME, {
      params: {
        term: filter.term,
        searchfield: filter.searchfield,
        sortfield: filter.sortfield,
        order: filter.order,
      },
      responseType: 'json',
    });
  }
  getCharacter(id: number): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id,
      httpOptions
    );
  }

  getAllVotesDates(): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/GetAllDates',
      httpOptions
    );
  }

  getPopularCharacters(date: String): Observable<any> {
    alert('called');
    return this.http.get(
      CommonFunctions.API_URL +
        CONTROLLER_NAME +
        '/PopularCharacterByTime/' +
        date,
      httpOptions
    );
  }

  GetTotalVotes(filter: ReportFilter): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/getTotalVotes',
      {
        params: {
          startDate: filter.startDate,
          endDate: filter.endDate,
          filterByDateRange: filter.filterByDateRange,
          characterId: filter.id,
        },
        responseType: 'json',
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }

  GetTotalVotesPerCharacter(filter: ReportFilter): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/getTotalVotesPerCharacter',
      {
        params: {
          startDate: filter.startDate,
          endDate: filter.endDate,
          filterByDateRange: filter.filterByDateRange,
        },
        responseType: 'json',
      }
    );
  }
  GetTopFiveCharacters(filter: ReportFilter): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/GetTopFiveCharacters',
      {
        params: {
          startDate: filter.startDate,
          endDate: filter.endDate,
          filterByDateRange: filter.filterByDateRange,
        },
        responseType: 'json',
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }

  PopularCharacterByTime(filter: ReportFilter): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/PopularCharacterByTime',
      {
        params: {
          startDate: filter.startDate,
          endDate: filter.endDate,
          filterByDateRange: filter.filterByDateRange,
        },
        responseType: 'json',
      }
    );
  }

  deleteCharacter(id: number): Observable<any> {
    return this.http.delete(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/' + id,
      httpOptions
    );
  }

  createOrUpdate(
    id: number,
    name: string,
    description: string,
    picture: string
  ): Observable<any> {
    if (id > 0) {
      return this.http.put(
        CommonFunctions.API_URL + CONTROLLER_NAME,
        {
          id,
          name,
          description,
          picture,
        },
        CommonFunctions.httpOptions
      );
    } else {
      return this.http.post(
        CommonFunctions.API_URL + CONTROLLER_NAME,
        {
          id,
          name,
          description,
          picture,
        },
        CommonFunctions.httpOptions
      );
    }
  }

  vote(id: number): Observable<any> {
    return this.http.get(
      CommonFunctions.API_URL + CONTROLLER_NAME + '/vote/' + id,
      httpOptions
    );
  }
}
