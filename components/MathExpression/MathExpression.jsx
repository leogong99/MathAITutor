import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import './MathExpression.css';

const MathExpression = ({ text }) => {
  // First, replace escaped newlines with actual newlines
  const processedText = text.replace(/\\n/g, '\n');

  // Split the text by math expressions
  // eslint-disable-next-line no-useless-escape
  const parts = processedText.split(/(\\\[.*?\\\]|\\\(.*?\\\))/g);

  return (
    <div className="math-expression">
      {parts.map((part, index) => {
        // Check if the part is a math expression
        if (part.startsWith('\\[') && part.endsWith('\\]')) {
          // Remove the \[ and \] delimiters and fix text commands
          const math = part.slice(2, -2).replace(/text{/g, '\\text{');
          return <BlockMath key={index} math={math} />;
        } else if (part.startsWith('\\(') && part.endsWith('\\)')) {
          // Remove the \( and \) delimiters and fix text commands
          const math = part.slice(2, -2).replace(/text{/g, '\\text{');
          return <InlineMath key={index} math={math} />;
        } else {
          // Replace any remaining escaped characters
          const cleanText = part
            .replace(/\\,/g, ',')
            .replace(/\\text/g, 'text')
            .replace(/\\,/g, ',')
            .replace(/\\,/g, ',')
            .replace(/\\,/g, ',');
          return <pre key={index}>{cleanText}</pre>;
        }
      })}
    </div>
  );
};

export default MathExpression; 