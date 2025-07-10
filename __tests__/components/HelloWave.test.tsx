import React from 'react';
import { render, screen } from '@testing-library/react';
import HelloWave from '../../components/HelloWave';

test('renders HelloWave component', () => {
	render(<HelloWave />);
	const linkElement = screen.getByText(/hello wave/i);
	expect(linkElement).toBeInTheDocument();
});