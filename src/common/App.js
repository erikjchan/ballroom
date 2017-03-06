import React from 'react';
import Helmet from "react-helmet";

export default ({children}) => {
  return (
    <div id="container">
      <Helmet
        link={[
          {rel: 'stylesheet', href:'https://npmcdn.com/react-bootstrap-table/dist/react-bootstrap-table-all.min.css'},
          {rel: "stylesheet", href: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"}
        ]}
        script={[
          {src: "https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.js"}
        ]}
      />
      {children}
    </div>
  );
}
