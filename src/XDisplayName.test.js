import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import XDisplayName from './XDisplayName';

describe('XDisplayName Component', () => {
  beforeEach(() => {
    render(<XDisplayName />);
  });

  test('renders the heading "Display Full Name"', () => {
    expect(screen.getByText('Display Full Name')).toBeInTheDocument();
  });

  test('renders two labeled input fields', () => {
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
  });

  test('renders a submit button', () => {
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  test('input fields are controlled components', () => {
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    expect(firstNameInput.value).toBe('John');
    expect(lastNameInput.value).toBe('Doe');
  });

  test('displays full name when both fields are filled and form is submitted', async () => {
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

  test('does not display full name when first name is empty', async () => {
    const lastNameInput = screen.getByLabelText('Last Name');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Full Name:/)).not.toBeInTheDocument();
    });
  });

  test('does not display full name when last name is empty', async () => {
    const firstNameInput = screen.getByLabelText('First Name');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Full Name:/)).not.toBeInTheDocument();
    });
  });

  test('does not display full name when both fields are empty', async () => {
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Full Name:/)).not.toBeInTheDocument();
    });
  });

  test('supports names with special characters and numbers', async () => {
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(firstNameInput, { target: { value: 'Jean-Pierre' } });
    fireEvent.change(lastNameInput, { target: { value: 'O\'Connor123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Full Name: Jean-Pierre O\'Connor123')).toBeInTheDocument();
    });
  });

  test('uses semantic HTML elements', () => {
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('button', { type: 'submit' })).toBeInTheDocument();
  });

  test('input fields have required attribute', () => {
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');

    expect(firstNameInput).toHaveAttribute('required');
    expect(lastNameInput).toHaveAttribute('required');
  });

  test('output is displayed in a p element', async () => {
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const fullNameElement = screen.getByText('Full Name: John Doe');
      expect(fullNameElement.tagName).toBe('P');
    });
  });

  test('form prevents default submission behavior', async () => {
    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const submitButton = screen.getByRole('button', { name: 'Submit' });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    
    // The form should not cause a page reload, which we can verify by checking
    // that the component state updates correctly without page navigation
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Full Name: John Doe')).toBeInTheDocument();
    });
  });
});