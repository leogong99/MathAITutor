import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageUpload from './ImageUpload';

describe('ImageUpload', () => {
  const mockOnImageSelect = jest.fn();
  const mockOnClearImage = jest.fn();
  const mockFileInputRef = { current: document.createElement('input') };

  const defaultProps = {
    onImageSelect: mockOnImageSelect,
    onClearImage: mockOnClearImage,
    isUploading: false,
    selectedImage: null,
    fileInputRef: mockFileInputRef,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders upload button when no image is selected', () => {
    render(<ImageUpload {...defaultProps} />);
    expect(screen.getByText('📷 Add Image')).toBeInTheDocument();
  });

  it('shows uploading state', () => {
    render(<ImageUpload {...defaultProps} isUploading={true} />);
    expect(screen.getByText('📤 Uploading...')).toBeInTheDocument();
  });

  it('handles file selection', () => {
    render(<ImageUpload {...defaultProps} />);
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]');
    
    fireEvent.change(input, { target: { files: [file] } });
    expect(mockOnImageSelect).toHaveBeenCalledWith(file);
  });

  it('shows image preview and clear button when image is selected', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    URL.createObjectURL = jest.fn(() => 'blob:test-url');
    render(<ImageUpload {...defaultProps} selectedImage={file} />);
    
    expect(screen.getByAltText('Preview')).toBeInTheDocument();
    expect(screen.getByText('✖')).toBeInTheDocument();
    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
  });

  it('handles clear image button click', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    render(<ImageUpload {...defaultProps} selectedImage={file} />);
    
    fireEvent.click(screen.getByText('✖'));
    expect(mockOnClearImage).toHaveBeenCalled();
  });
}); 