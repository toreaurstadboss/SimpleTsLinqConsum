import { Component, Inject } from "@angular/core";
import { StarWarsMovies } from "simpletslinq/dist/StarwarsMovies";
import { Movie } from "simpletslinq/dist/Movie";
import "simpletslinq";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "SimpleTsLinq Consum demo";

  firstMovieWithBoba: Movie;
  lastMovieWithBoba: Movie;
  allMoviesWithLeia: Movie[];
  starwarsMovies: string;
  allTitlesAndEpisodeNumbers: any[];
  groupedMoviesWithJarJarBinks: any[];

  movieStarringJarJarBinks: boolean;

  movieStarringSomeOneSkyWalker: boolean;

  someGeneratedNumbers: number[];

  constructor() {
    const someNums = [1, 3, 4, 5, 8, 11, 14, 13, 12, 18];
    const onlyEvenNumbers = someNums.RemoveWhere<number>(x => x % 2 === 0);
    if (onlyEvenNumbers !== null) {
    }

    this.starwarsMovies = JSON.stringify(StarWarsMovies);
    this.firstMovieWithBoba = StarWarsMovies.FirstOrDefault<Movie>(
      m => m.main_characters.indexOf("Boba Fett") >= 0
    );
    this.allMoviesWithLeia = StarWarsMovies.Where<Movie>(
      m => m.main_characters.indexOf("Princess Leia Organa") >= 0
    );

    this.lastMovieWithBoba = StarWarsMovies.LastOrDefault<Movie>(
      m => m.main_characters.indexOf("Boba Fett") >= 0
    );

    console.log(this.firstMovieWithBoba);
    console.log(this.allMoviesWithLeia);
    this.allTitlesAndEpisodeNumbers = StarWarsMovies.Select<Movie>(
      "title",
      "episode_number"
    );
    this.groupedMoviesWithJarJarBinks = StarWarsMovies.GroupBy<Movie>(movie =>
      movie.main_characters.indexOf("Jar Jar Binks") >= 0
        ? "Movie starring JarJar"
        : "Movie not starring JarJar"
    );

    console.log(this.allTitlesAndEpisodeNumbers);
    console.log(this.groupedMoviesWithJarJarBinks);

    console.log("Generating some numbers in an enumerable range");
    for (let num in [].EnumerableRange(1, 10)) {
      console.log(num);
    }
    this.someGeneratedNumbers = [].EnumerableRange(1, 10);

    this.movieStarringJarJarBinks = StarWarsMovies.Any<Movie>(
      m => m.main_characters.indexOf("Jar Jar Binks") >= 0
    );
    this.movieStarringSomeOneSkyWalker = StarWarsMovies.All<Movie>(m =>
      m.main_characters.Any<string>(ch => ch.search(/SkyWalker/i) >= 0)
    );
  }
}
