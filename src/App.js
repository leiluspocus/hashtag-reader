import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    // Déclaration de l'état applicatif
    this.state = {hashtag: '', hashtagContent : []}; 

    // Déclaration des événements
    this.defineHashtag = this.defineHashtag.bind(this);
    this.fetchFeed = this.fetchFeed.bind(this);
  }

  // 
  defineHashtag(event) {
    this.setState({ hashtag : event.target.value , hashtagContent : []}); 
  }

  fetchFeed(event) { 
    event.preventDefault(); 
    fetch('https://api.instagram.com/v1/tags/' + this.state.hashtag + 
    '/media/recent?access_token=' 
    + process.env.REACT_APP_INSTAGRAM_ACC_KEY )
    .then(r => r.json())
    .then(function(response) { 
      let images = [];
      let index = 1;
      response.data.forEach(function(element) {
        images.push({"thumbnail" : element.images.thumbnail.url, "link" : element.link, "id" : index });
        index++;
      });
      return images;
     })
     .then(images => this.setState({hashtag: this.state.hashtag, hashtagContent : images}))
    .catch(error => console.log("ERREUR " + error)); 
  }

  render() { 
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Hashtag Reader</h1>
        </header>
        <div className="App-intro">
            <form onSubmit={this.fetchFeed}>
              <input type="text" autoFocus required placeholder="Entre un hashtag ..." onChange={this.defineHashtag} />
              <input type="submit" value="GO" />
            </form>
        </div>
          <div className="noPostsFound">
          {this.state.hashtagContent.length === 0 &&
              <h2>
                Aucun post trouvé sur #{ this.state.hashtag }
              </h2>
            }
          </div>
          <div className="instacontainer">
            {this.state.hashtagContent.map(hit =>
              <div key={hit.id} className="instapicture">
                <a href={hit.link} target="_blank"><img alt="" src={hit.thumbnail} /></a>
              </div>
            )}
          </div>
          <div className="credits">
            Par <a href="http://latrmouh.org">Laïla</a>
          </div>
      </div>
    );
  }
}

export default App;
