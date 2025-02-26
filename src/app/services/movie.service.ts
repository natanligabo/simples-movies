import { Injectable } from '@angular/core';
import { Movie } from '../@types/Movie';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credits } from '../@types/Credits';
import { MovieResponse } from '../@types/MovieResponse';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl = 'https://api.themoviedb.org/3/movie';

  private defaultHeaders = {
    Authorization: 'Bearer ' + environment.apiKey,
  };

  constructor(private http: HttpClient) {}

  public getTopRatedMovies(
    language: string,
    page: number
  ): Observable<MovieResponse> {
    const params = new HttpParams().set('language', language).set('page', page);

    return this.http.get<MovieResponse>(`${this.apiUrl}/top_rated`, {
      params: params,
      headers: this.defaultHeaders,
    });
  }

  public getPopularMovies(
    language: string,
    page: number
  ): Observable<MovieResponse> {
    const params = new HttpParams().set('language', language).set('page', page);

    return this.http.get<MovieResponse>(`${this.apiUrl}/popular`, {
      params: params,
      headers: this.defaultHeaders,
    });
  }

  public getUpcomingMovies(
    language: string,
    page: number
  ): Observable<MovieResponse> {
    const params = new HttpParams().set('language', language).set('page', page);

    return this.http.get<MovieResponse>(`${this.apiUrl}/upcoming`, {
      params: params,
      headers: this.defaultHeaders,
    });
  }

  public getMovieRecommendationById(
    language: string,
    page: number,
    movieId: number
  ): Observable<MovieResponse> {
    const params = new HttpParams().set('language', language).set('page', page);

    return this.http.get<MovieResponse>(`${this.apiUrl}/${movieId}/recommendations`, {
      params: params,
      headers: this.defaultHeaders,
    });
  }

  public getMovieDetailsById(id: number, language: string): Observable<Movie> {
    const params = new HttpParams().set('language', language);

    return this.http.get<Movie>(`${this.apiUrl}/${id}`, {
      params: params,
      headers: this.defaultHeaders,
    });
  }

  public getCreditsByMovieId(id: number, language: string): Observable<Credits> {
    const params = new HttpParams().set('language', language);

    return this.http.get<Credits>(`${this.apiUrl}/${id}/credits`, {
      params: params,
      headers: this.defaultHeaders,
    });
  }
}
