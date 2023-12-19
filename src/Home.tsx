import React from 'react';
import ReactMarkdown from 'react-markdown';
import readme from '../README.md';

const HomePage: React.FC = () => {
  // console.log(readme)
  return (
    <ReactMarkdown children={readme} />
  );
};

export default HomePage;
