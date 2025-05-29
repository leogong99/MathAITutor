import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './MathExpression.css';

const MathExpression = ({ text }) => {
  // Split the text by math expressions
  // eslint-disable-next-line no-useless-escape
  const parts = text.split(/(\\[\[\(].*?\\[\]\)])/g);

  return (
    <div className="math-expression">
      {parts.map((part, index) => {
        // Check if the part is a math expression
        if (part.startsWith('\\[') && part.endsWith('\\]')) {
          // Remove the \[ and \] delimiters
          const math = part.slice(2, -2);
          return <BlockMath key={index} math={math} />;
        } else if (part.startsWith('\\(') && part.endsWith('\\)')) {
          // Remove the \( and \) delimiters
          const math = part.slice(2, -2);
          return <InlineMath key={index} math={math} />;
        } else {
          return <span key={index}>{part}</span>;
        }
      })}
    </div>
  );
};

export default MathExpression; 