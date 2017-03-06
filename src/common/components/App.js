import React from 'react';
import Helmet from "react-helmet";

export default ({children}) => {
  return (
    <div id="container">
      <Helmet
        link={[
            {rel: 'stylesheet', href:'https://npmcdn.com/react-bootstrap-table/dist/react-bootstrap-table-all.min.css'},
            {rel: "apple-touch-icon", href: "http://mysite.com/img/apple-touch-icon-57x57.png"},
            {rel: "apple-touch-icon", sizes: "72x72", href: "http://mysite.com/img/apple-touch-icon-72x72.png"},
            {rel: "stylesheet", href: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"}
        ]}
      />
      {children}
    </div>
  );
}
