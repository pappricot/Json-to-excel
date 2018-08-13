import React from 'react';

class SearchBar extends React.Component{
    render() {
      return (
        <form>
          <input type="text" placeholder="Search a term..." />
        </form>
      );
    }
  }

export default(SearchBar);