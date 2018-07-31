import React from "react";
import { Container } from "semantic-ui-react";
import Header from "./Header";
import Head from "next/head";

export default props => {
  return (
    <Container>
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"
        />
      </Head>
      <Header />
      {props.children}
    </Container>
  );
};
