import React from 'react';
import Helmet from "react-helmet";

const stylesheets = [
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  'https://fonts.googleapis.com/css?family=Roboto',
  'https://unpkg.com/purecss@0.6.2/build/pure-min.css',
]

export default ({children}) => {
  return (
    <div>
      <Helmet
        link={ stylesheets.map(s => ({rel:'stylesheet', href:s})) }
        script={[
          {src: "https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.js"}
        ]}
      />
      {children}
    </div>
  );
}
