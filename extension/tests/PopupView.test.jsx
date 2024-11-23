// extension/tests/PopupView.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PopupView from '../src/components/PopupView';

describe('PopupView', () => {
    test('renders date inputs', () => {
        render(<PopupView />);
        expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    });

    test('handles date selection', () => {
        render(<PopupView />);
        const startDateInput = screen.getByLabelText(/start date/i);
        fireEvent.change(startDateInput, { target: { value: '2024-03-23' } });
        expect(startDateInput.value).toBe('2024-03-23');
    });
});