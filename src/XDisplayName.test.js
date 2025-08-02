import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import XDisplayName from './XDisplayName';

describe('XDisplayName Component', () => {
  test('renders the heading "Display Full Name"', () => {
    render(<XDisplayName />);
    expect(screen.getByText('Display Full Name')).toBeInTheDocument();
  });

  test('renders two labeled input fields', () => {
    render(<XDisplayName />);
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
  });

  test('renders a submit button', () => {
    render(<XDisplayName />);
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  test('shows full name when both fields are filled and form is submitted', async () => {
    render(<XDisplayName />);
    
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Full Name: John Doe')).toBeInTheDocument();
    });
  });

  test('does not show full name when first name is empty', async () => {
    render(<XDisplayName />);
    
    const lastNameInput = screen.getByLabelText('Last Name');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Full Name:/)).not.toBeInTheDocument();
    });
  });

  test('does not show full name when last name is empty', async () => {
    render(<XDisplayName />);
    
    const firstNameInput = screen.getByLabelText('First Name');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Full Name:/)).not.toBeInTheDocument();
    });
  });

  test('does not show full name when both fields are empty', async () => {
    render(<XDisplayName />);
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Full Name:/)).not.toBeInTheDocument();
    });
  });

  test('supports names with special characters', async () => {
    render(<XDisplayName />);
    
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(firstNameInput, { target: { value: 'José' } });
    fireEvent.change(lastNameInput, { target: { value: 'O\'Connor' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Full Name: José O\'Connor')).toBeInTheDocument();
    });
  });

  test('supports names with numbers', async () => {
    render(<XDisplayName />);
    
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(firstNameInput, { target: { value: 'John123' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe456' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Full Name: John123 Doe456')).toBeInTheDocument();
    });
  });

  test('prevents form submission with e.preventDefault()', async () => {
    const mockPreventDefault = jest.fn();
    render(<XDisplayName />);
    
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    
    // Mock the preventDefault function
    const originalPreventDefault = Event.prototype.preventDefault;
    Event.prototype.preventDefault = mockPreventDefault;
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockPreventDefault).toHaveBeenCalled();
    });
    
    // Restore original function
    Event.prototype.preventDefault = originalPreventDefault;
  });

  test('uses controlled components with value and onChange props', () => {
    render(<XDisplayName />);
    
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');

    expect(firstNameInput).toHaveValue('');
    expect(lastNameInput).toHaveValue('');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    expect(firstNameInput).toHaveValue('John');
    expect(lastNameInput).toHaveValue('Doe');
  });

  test('has required validation on input fields', () => {
    render(<XDisplayName />);
    
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');

    expect(firstNameInput).toHaveAttribute('required');
    expect(lastNameInput).toHaveAttribute('required');
  });

  test('uses semantic HTML elements', () => {
    render(<XDisplayName />);
    
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });
});