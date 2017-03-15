import React from 'react';
import Helmet from "react-helmet";

const stylesheets = [
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  'https://fonts.googleapis.com/css?family=Roboto',
  'https://unpkg.com/purecss@0.6.2/build/pure-min.css',
  // 'https://npmcdn.com/react-bootstrap-table/dist/react-bootstrap-table-all.min.css',
  // "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
  // 'https://cdnjs.cloudflare.com/ajax/libs/fixed-data-table/0.6.3/fixed-data-table-style.css'
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
