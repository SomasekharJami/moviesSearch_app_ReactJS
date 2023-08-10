import { Component } from "react";
import { TailSpin } from "react-loader-spinner";
import "./App.css";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class App extends Component {
  state = {
    searchInput: "",
    moviesList: [],
    apiStatus: apiStatusConstants.initial,
  };

  onEnteringMovie = (event) => {
    this.setState({ searchInput: event.target.value });
  };

  onSearching = async () => {
    const { searchInput } = this.state;
    if (searchInput.length > 0) {
      this.setState({ apiStatus: apiStatusConstants.inProgress });
      const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=e8ccc676e299173067a80520c1fee405&query=${searchInput}`;
      const response = await fetch(apiUrl);
      if (response.ok) {
        const fetchedData = await response.json();
        console.log(fetchedData);
        const updatedData = fetchedData.results.map((movie) => ({
          id: movie.id,
          title: movie.original_title,
          overview: movie.overview,
          popularity: movie.popularity,
          posterUrl: movie.poster_path,
          releaseDate: movie.release_date,
        }));
        this.setState({
          moviesList: updatedData,
          apiStatus: apiStatusConstants.success,
          searchInput: "",
        });
      } else {
        this.setState({ apiStatus: apiStatusConstants.failure });
      }
    } else {
      alert("Please Enter the Movie Name.");
    }
  };

  renderingSuccessView = () => {
    const { moviesList } = this.state;

    return (
      <ul className="listToShow">
        {moviesList.map((eachMovie) => (
          <li className="movieItem" key={eachMovie.id}>
            <img
              src={`//image.tmdb.org/t/p/original${eachMovie.posterUrl}`}
              alt={eachMovie.title}
              className="moviePoster"
            />
            <div className="detailsCon">
              <h1 className="movieName">{eachMovie.title}</h1>
              <p className="dateP">RELEASE DATE: {eachMovie.releaseDate}</p>
              <p className="ratingP">RATING: {eachMovie.popularity}</p>
              <p className="descP">{eachMovie.overview}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  renderingFailureView = () => (
    <div className="failCon">
      <p className="failP">!Oh no something went wrong, 404 error</p>
    </div>
  );

  renderingInprogressView = () => (
    <div className="ipCon">
      <TailSpin color="#0b69ff" height="50" width="50" />
    </div>
  );

  renderFinalResult = () => {
    const { apiStatus } = this.state;

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderingSuccessView();
      case apiStatusConstants.failure:
        return this.renderingFailureView();
      case apiStatusConstants.inProgress:
        return this.renderingInprogressView();
      default:
        return null;
    }
  };

  render() {
    const { searchInput } = this.state;
    return (
      <div className="App">
        <div className="mainCon">
          <h1 className="mainH">MOVIE SEARCH</h1>
          <div className="searchCon">
            <label className="labEl" htmlFor="inputEl">
              MOVIE NAME
            </label>
            <input
              type="text"
              className="inpEl"
              id="inputEl"
              value={searchInput}
              onChange={this.onEnteringMovie}
              placeholder="Enter movie name here"
            />
            <button type="button" className="bton" onClick={this.onSearching}>
              Search Movie
            </button>
          </div>
        </div>
        <div className="moviesCon">{this.renderFinalResult()}</div>
      </div>
    );
  }
}

export default App;
