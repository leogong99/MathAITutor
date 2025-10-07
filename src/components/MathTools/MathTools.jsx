import { useState, useRef, useEffect, useCallback } from 'react';
import './MathTools.css';

const MathTools = ({ onToolResult, isVisible = false }) => {
  const [activeTool, setActiveTool] = useState('calculator');
  const [calculatorDisplay, setCalculatorDisplay] = useState('0');
  const [equationDisplay, setEquationDisplay] = useState('');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingHistory, setDrawingHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [isSendingDrawing, setIsSendingDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Calculator functions
  const inputNumber = (num) => {
    if (waitingForOperand) {
      setCalculatorDisplay(String(num));
      setWaitingForOperand(false);
      // Update equation display with the new number
      setEquationDisplay(equationDisplay + String(num));
    } else {
      const newDisplay = calculatorDisplay === '0' ? String(num) : calculatorDisplay + num;
      setCalculatorDisplay(newDisplay);
      // Update equation display
      if (equationDisplay === '') {
        setEquationDisplay(String(num));
      } else {
        // Replace the last number in the equation
        const lastOperatorIndex = Math.max(
          equationDisplay.lastIndexOf('+'),
          equationDisplay.lastIndexOf('-'),
          equationDisplay.lastIndexOf('×'),
          equationDisplay.lastIndexOf('÷')
        );
        if (lastOperatorIndex === -1) {
          setEquationDisplay(String(num));
        } else {
          setEquationDisplay(equationDisplay.substring(0, lastOperatorIndex + 1) + newDisplay);
        }
      }
    }
  };

  const inputOperation = (nextOperation) => {
    const inputValue = parseFloat(calculatorDisplay);

    if (previousValue === null) {
      setPreviousValue(inputValue);
      // Add the operation to equation display
      setEquationDisplay(equationDisplay + nextOperation);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setCalculatorDisplay(String(newValue));
      setPreviousValue(newValue);
      // Update equation display with the result and new operation
      setEquationDisplay(String(newValue) + nextOperation);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+': return firstValue + secondValue;
      case '-': return firstValue - secondValue;
      case '×': return firstValue * secondValue;
      case '÷': return secondValue !== 0 ? firstValue / secondValue : 0;
      case '=': return secondValue;
      default: return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(calculatorDisplay);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setCalculatorDisplay(String(newValue));
      // Update equation display to show the complete equation with result
      setEquationDisplay(equationDisplay + '=' + String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clearCalculator = () => {
    setCalculatorDisplay('0');
    setEquationDisplay('');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setCalculatorDisplay('0.');
      setWaitingForOperand(false);
      // Update equation display with the decimal
      setEquationDisplay(equationDisplay + '0.');
    } else if (calculatorDisplay.indexOf('.') === -1) {
      const newDisplay = calculatorDisplay + '.';
      setCalculatorDisplay(newDisplay);
      // Update equation display
      if (equationDisplay === '') {
        setEquationDisplay('0.');
      } else {
        // Replace the last number in the equation
        const lastOperatorIndex = Math.max(
          equationDisplay.lastIndexOf('+'),
          equationDisplay.lastIndexOf('-'),
          equationDisplay.lastIndexOf('×'),
          equationDisplay.lastIndexOf('÷')
        );
        if (lastOperatorIndex === -1) {
          setEquationDisplay(newDisplay);
        } else {
          setEquationDisplay(equationDisplay.substring(0, lastOperatorIndex + 1) + newDisplay);
        }
      }
    }
  };

  // Drawing functions
  const startDrawing = useCallback((e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  }, []);

  const draw = useCallback((e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Mark that user has drawn something
    setHasDrawn(true);
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      setDrawingHistory(prev => [...prev.slice(0, historyStep + 1), imageData]);
      setHistoryStep(prev => prev + 1);
    }
  }, [isDrawing, historyStep]);

  const clearDrawing = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Reset canvas background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setDrawingHistory([]);
    setHistoryStep(-1);
    setHasDrawn(false);
  };

  const undoDrawing = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(drawingHistory[historyStep - 1], 0, 0);
      setHistoryStep(prev => prev - 1);
    }
  };

  const redoDrawing = () => {
    if (historyStep < drawingHistory.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(drawingHistory[historyStep + 1], 0, 0);
      setHistoryStep(prev => prev + 1);
    }
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    
    // Check if there's content on the canvas
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Check for any non-transparent pixels
    let hasContent = false;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) {
        hasContent = true;
        break;
      }
    }

    // Alternative check: look for any non-zero RGB values
    if (!hasContent) {
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0) {
          hasContent = true;
          break;
        }
      }
    }

    if (!hasContent) {
      alert('Please draw something before downloading!');
      return;
    }

    // Create high-resolution version for download with white background
    const scaleFactor = 2;
    const highResCanvas = document.createElement('canvas');
    const highResCtx = highResCanvas.getContext('2d');
    
    highResCanvas.width = canvas.width * scaleFactor;
    highResCanvas.height = canvas.height * scaleFactor;
    
    // Ensure white background for the high-res canvas
    highResCtx.fillStyle = 'white';
    highResCtx.fillRect(0, 0, highResCanvas.width, highResCanvas.height);
    
    // Scale up the drawing
    highResCtx.scale(scaleFactor, scaleFactor);
    highResCtx.drawImage(canvas, 0, 0);
    
    // Create download link
    const link = document.createElement('a');
    link.download = `math-drawing-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
    link.href = highResCanvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sendDrawingResult = () => {
    const canvas = canvasRef.current;
    
    // Better method to check if there's content on the canvas
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Debug: Log some pixel data to help troubleshoot
    console.log('Canvas size:', canvas.width, 'x', canvas.height);
    console.log('First few pixels:', data.slice(0, 20));
    
    // Check for any non-transparent pixels (more reliable method)
    let hasContent = false;
    let nonTransparentPixels = 0;
    
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) { // Check alpha channel
        nonTransparentPixels++;
        hasContent = true;
      }
    }

    console.log('Non-transparent pixels found:', nonTransparentPixels);

    // Alternative check: look for any non-zero RGB values
    if (!hasContent) {
      let coloredPixels = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0) {
          coloredPixels++;
          hasContent = true;
        }
      }
      console.log('Colored pixels found:', coloredPixels);
    }

    if (!hasContent) {
      alert(`Please draw something before sending! 
      
Debug info:
- Canvas size: ${canvas.width}x${canvas.height}
- Non-transparent pixels: ${nonTransparentPixels}
- Try drawing with a darker color or thicker strokes.`);
      return;
    }

    setIsSendingDrawing(true);

    // Create a higher resolution canvas for better OCR
    const scaleFactor = 2; // Double the resolution
    const highResCanvas = document.createElement('canvas');
    const highResCtx = highResCanvas.getContext('2d');
    
    highResCanvas.width = canvas.width * scaleFactor;
    highResCanvas.height = canvas.height * scaleFactor;
    
    // Ensure white background for the high-res canvas
    highResCtx.fillStyle = 'white';
    highResCtx.fillRect(0, 0, highResCanvas.width, highResCanvas.height);
    
    // Scale up the drawing for better OCR recognition
    highResCtx.scale(scaleFactor, scaleFactor);
    highResCtx.drawImage(canvas, 0, 0);
    
    // Convert high-res canvas to blob for proper image upload
    highResCanvas.toBlob((blob) => {
      if (blob) {
        console.log('High-res drawing blob created, size:', blob.size, 'bytes');
        console.log('High-res canvas size:', highResCanvas.width, 'x', highResCanvas.height);
        // Create a File object from the blob
        const file = new File([blob], 'drawing.png', { type: 'image/png' });
        onToolResult('drawing', file);
        setIsSendingDrawing(false);
      }
    }, 'image/png');
  };

  const sendCalculatorResult = () => {
    // Send the equation if it exists, otherwise send the current display
    const resultToSend = equationDisplay || calculatorDisplay;
    onToolResult('calculation', resultToSend);
  };

  // Initialize canvas with white background (only once)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      // Set up drawing properties for better OCR recognition
      ctx.strokeStyle = '#000000'; // Black color for better contrast
      ctx.lineWidth = 4; // Thicker lines for better recognition
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Set up touch events for mobile
      const handleTouchStart = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        startDrawing({ clientX: x, clientY: y });
      };
      
      const handleTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        draw({ clientX: x, clientY: y });
      };
      
      const handleTouchEnd = (e) => {
        e.preventDefault();
        stopDrawing();
      };
      
      canvas.addEventListener('touchstart', handleTouchStart);
      canvas.addEventListener('touchmove', handleTouchMove);
      canvas.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [startDrawing, draw, stopDrawing]);

  if (!isVisible) return null;

  return (
    <div className="math-tools">
      <div className="tools-header">
        <h3>Math Tools</h3>
        <div className="tool-tabs">
          <button 
            className={`tool-tab ${activeTool === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveTool('calculator')}
          >
            🧮 Calculator
          </button>
          <button 
            className={`tool-tab ${activeTool === 'drawing' ? 'active' : ''}`}
            onClick={() => setActiveTool('drawing')}
          >
            ✏️ Drawing Board
          </button>
        </div>
      </div>

      <div className="tool-content">
        {activeTool === 'calculator' && (
          <div className="calculator">
            <div className="calculator-display">
              <div className="equation-display">{equationDisplay || '0'}</div>
              <div className="display-value">{calculatorDisplay}</div>
            </div>
            <div className="calculator-buttons">
              <button className="calc-btn clear" onClick={clearCalculator}>C</button>
              <button className="calc-btn operator" onClick={() => inputOperation('÷')}>÷</button>
              <button className="calc-btn operator" onClick={() => inputOperation('×')}>×</button>
              <button className="calc-btn operator" onClick={() => inputOperation('-')}>-</button>
              
              <button className="calc-btn number" onClick={() => inputNumber(7)}>7</button>
              <button className="calc-btn number" onClick={() => inputNumber(8)}>8</button>
              <button className="calc-btn number" onClick={() => inputNumber(9)}>9</button>
              <button className="calc-btn operator" onClick={() => inputOperation('+')}>+</button>
              
              <button className="calc-btn number" onClick={() => inputNumber(4)}>4</button>
              <button className="calc-btn number" onClick={() => inputNumber(5)}>5</button>
              <button className="calc-btn number" onClick={() => inputNumber(6)}>6</button>
              <button className="calc-btn equals" onClick={performCalculation}>=</button>
              
              <button className="calc-btn number" onClick={() => inputNumber(1)}>1</button>
              <button className="calc-btn number" onClick={() => inputNumber(2)}>2</button>
              <button className="calc-btn number" onClick={() => inputNumber(3)}>3</button>
              <button className="calc-btn number" onClick={() => inputNumber(0)}>0</button>
              
              <button className="calc-btn decimal" onClick={inputDecimal}>.</button>
              <button className="calc-btn send" onClick={sendCalculatorResult}>Send</button>
            </div>
          </div>
        )}

        {activeTool === 'drawing' && (
          <div className="drawing-board">
            <div className="drawing-controls">
              <button className="draw-btn" onClick={undoDrawing} disabled={historyStep <= 0}>
                ↶ Undo
              </button>
              <button className="draw-btn" onClick={redoDrawing} disabled={historyStep >= drawingHistory.length - 1}>
                ↷ Redo
              </button>
              <button className="draw-btn clear" onClick={clearDrawing}>
                🗑️ Clear
              </button>
              <button 
                className="draw-btn download" 
                onClick={downloadDrawing}
                disabled={!hasDrawn}
              >
                💾 Download
              </button>
              <button 
                className="draw-btn send" 
                onClick={sendDrawingResult}
                disabled={isSendingDrawing || !hasDrawn}
              >
                {isSendingDrawing ? '📤 Sending...' : hasDrawn ? '📤 Send Drawing' : '📤 Draw First'}
              </button>
            </div>
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="drawing-canvas"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={() => {
                if (isDrawing) {
                  stopDrawing();
                }
              }}
            />
            <div className="drawing-instructions">
              <p>Draw your math work here! Use your mouse or touch to draw.</p>
              <p className="drawing-tips">
                💡 Tips for better recognition:
                <br />• Write numbers and symbols clearly and large
                <br />• Use thick, dark strokes
                <br />• Space characters well apart
                <br />• Write &quot;1&quot; with a clear vertical line
                <br />• Make &quot;+&quot; and &quot;=&quot; distinct from other symbols
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MathTools;
