import React, { Component } from 'react';

import 'styles/App.css';

class App extends Component {
    static path = '/';

    render() {
        return (
            <div className="App">
                Header
                {this.props.children}
            </div>
        );
    }
}

export default App;
