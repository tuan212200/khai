import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Collapsible } from './Collapsible';

describe('Collapsible Component', () => {
    it('renders the title correctly', () => {
        const { getByText } = render(<Collapsible title="Test Title">Test Content</Collapsible>);
        expect(getByText('Test Title')).toBeTruthy();
    });

    it('toggles content visibility on press', () => {
        const { getByText, queryByText } = render(
            <Collapsible title="Test Title">Test Content</Collapsible>
        );

        // Initially, content should not be visible
        expect(queryByText('Test Content')).toBeNull();

        // Simulate press to open
        fireEvent.press(getByText('Test Title'));
        expect(getByText('Test Content')).toBeTruthy();

        // Simulate press to close
        fireEvent.press(getByText('Test Title'));
        expect(queryByText('Test Content')).toBeNull();
    });
});