import React, { Component } from 'react';
import './App.css';
import Search from './Search.js';
import Table from './Table.js';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null,
            searchTerm: DEFAULT_QUERY,
        };

        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }

    onDismiss(id) {
        const isNotId = item => item.objectID !== id;
        const updatedHits = this.state.result.hits.filter(isNotId);
        this.setState({
            result: { ...this.state.result, hits: updatedHits }
        });
    }

    onSearchChange(event) {
        this.setState({ searchTerm: event.target.value });
    }

    setSearchTopStories(result) {
        this.setState({ result });
    }

    fetchSearchTopStories(searchTerm) {
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(e => e);
    }

    componentDidMount() {
        const { searchTerm } = this.state;
        this.fetchSearchTopStories(searchTerm);
    }

  render() {
      const { searchTerm, result } = this.state;
      if (!result) { return null; }
    return (
        <div className="page">
            <div className="interactions">
              <Search
                  value={searchTerm}
                  onChange={this.onSearchChange}
              >Search
              </Search>
            </div>
            { result
                ? <Table
                    list={result.hits}
                    pattern={searchTerm}
                    onDismiss={this.onDismiss}
                />
                : null
            }
      </div>
    );
  }
}

export default App;
