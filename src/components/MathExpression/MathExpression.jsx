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
          // Handle regular text - split by newlines and render each line
          const lines = part.split('\n');
          return (
            <div key={index}>
              {lines.map((line, lineIndex) => (
                <div key={lineIndex} style={{ marginBottom: line.trim() ? '0.5em' : '0' }}>
                  {line.trim() || '\u00A0'} {/* Non-breaking space for empty lines */}
                </div>
              ))}
            </div>
          );
        }
      })}
    </div>
  );
};

export default MathExpression; 