import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';
import { TranslatePipe } from '@ngx-translate/core';
import { CommonButtonComponent } from '../../components/common-button/common-button.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { FavoriteService } from '../../services/favorite.service';
import { TranslateService } from '../../services/translate.service';
import { LanguageSelectorComponent } from '../../components/language-selector/language-selector.component';
import { FavoriteMovie } from '../../@types/FavoriteMovie';
import { Movie } from '../../@types/Movie';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-home',
  imports: [
    BreadcrumbComponent,
    TranslatePipe,
    CommonButtonComponent,
    MovieCardComponent,
    LanguageSelectorComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  userFavoriteMovies: FavoriteMovie[] = [];
  moviesList: Movie[] = [];
  popularMoviesList: Movie[] = [];
  upcomingMoviesList: Movie[] = [];
  recommendationMoviesList: Movie[] = [];
  selectedLanguage = { name: 'Português', code: 'pt-BR' };

  constructor(
    private favoriteService: FavoriteService,
    private translateService: TranslateService,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.selectedLanguage = this.translateService.getCurrentLanguageValue();

    this.getCurrentLanguage();
    this.fetchFavoriteMovies();
    this.loadPopularMovies();
    this.loadUpcomingMovies();
  }

  loadPopularMovies() {
    this.movieService
      .getPopularMovies(this.selectedLanguage.code, 1)
      .subscribe({
        next: (data) => (this.popularMoviesList = data.results),
        error: (err) => console.error(err),
      });
  }

  loadUpcomingMovies() {
    this.movieService
      .getUpcomingMovies(this.selectedLanguage.code, 1)
      .subscribe({
        next: (data) => (this.upcomingMoviesList = data.results),
        error: (err) => console.error(err),
      });
  }

  fetchFavoriteMovies() {
    this.favoriteService.getFavorites().subscribe({
      next: (data) => {
        this.moviesList = [];
        this.userFavoriteMovies = data;
        this.loadRecommendationMovies();

        this.userFavoriteMovies.forEach((favoriteMovie) => {
          this.movieService
            .getMovieDetailsById(
              favoriteMovie.movieId,
              this.selectedLanguage.code
            )
            .subscribe({
              next: (value) => {
                this.moviesList.push(value);
              },
              error: (err) => console.error(err),
            });
        });
      },
      error: (err) => console.error(err),
    });
  }

  loadRecommendationMovies() {
    this.recommendationMoviesList = [];
    this.userFavoriteMovies.forEach((fav) => {
      this.loadRecommendationMovieById(fav.movieId);
    });
  }

  loadRecommendationMovieById(movieId: number) {
    this.movieService
      .getMovieRecommendationById(this.selectedLanguage.code, 1, movieId)
      .subscribe({
        next: (data) => {
          this.recommendationMoviesList.push(data.results[0]);
        },
        error: (err) => console.error(err),
      });
  }

  removeFavoriteMovie(movie: Movie) {
    const favorite = this.userFavoriteMovies.find(
      (fav) => fav.movieId === movie.id
    );

    if (favorite) {
      this.favoriteService.deleteFavoriteMovie(String(favorite.id)).subscribe({
        next: () => this.fetchFavoriteMovies(),
        error: (err) => console.error(err),
      });
    }
  }

  private getCurrentLanguage(): void {
    this.translateService.getCurrentLanguage().subscribe({
      next: (res) => {
        this.selectedLanguage = res;
        this.moviesList = [];
        this.popularMoviesList = [];
        this.upcomingMoviesList = [];
        this.fetchFavoriteMovies();
        this.loadPopularMovies();
        this.loadUpcomingMovies();
        this.loadRecommendationMovies();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  isMovieFavorite(movieId: number): boolean {
    return this.userFavoriteMovies.some(
      (movie) => Number(movie.id) === movieId
    );
  }

  toggleFavorite(movie: Movie) {
    if (this.isMovieFavorite(movie.id)) {
      const favorite = this.userFavoriteMovies.find(
        (fav) => fav.movieId === movie.id
      );
      if (favorite !== undefined) {
        this.favoriteService
          .deleteFavoriteMovie(String(favorite.id))
          .subscribe({
            next: () => {
              this.updateFavorites();
            },
            error: (err) => console.error(err),
          });
      }
    } else {
      this.favoriteService
        .createFavoriteMovie({ movieId: movie.id })
        .subscribe({
          next: () => {
            this.updateFavorites();
          },
          error: (err) => console.error(err),
        });
    }
  }

  private updateFavorites(): void {
    this.favoriteService.getFavorites().subscribe({
      next: (data) => {
        this.userFavoriteMovies = data;
      },
      error: (err) => console.error(err),
    });
  }
}
