import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import Card from '.';

describe('Card component', () => {
  it('Check on first load that the card is rendered correctly', () => {
    render(<Card key={1} value={10} isVisible enabled onClick={() => { }} />);
    expect(screen.getByText('?')).toBeVisible();
  });
  it('When an enabled, not shown card is clicked, then on click handler should be called and the card should show the value', async () => {
    const onClickHandler = jest.fn();
    render(
      <Card
        id={1}
        key={1}
        value={10}
        isVisible={false}
        enabled
        onClick={onClickHandler}
      />,
    );
    fireEvent.press(screen.getByTestId('card-id-1'));
    await waitFor(() => {
      expect(onClickHandler).toHaveBeenCalled();
      expect(screen.getByText('10')).toBeVisible();
    });
  });
  it('When a disabled, not shown card is clicked, then on click handler should NOT be called', async () => {
    const onClickHandler = jest.fn();
    render(
      <Card
        id={1}
        key={1}
        value={10}
        isVisible={false}
        enabled={false}
        onClick={onClickHandler}
      />,
    );
    fireEvent.press(screen.getByTestId('card-id-1'));
    await waitFor(() => {
      expect(onClickHandler).toHaveBeenCalledTimes(0);
      expect(screen.getByText('?')).toBeVisible();
    });
  });
  it('When an enabled, shown card is clicked, then on click handler should NOT be called', async () => {
    const onClickHandler = jest.fn();
    render(
      <Card
        id={1}
        key={1}
        value={10}
        isVisible={false}
        enabled
        onClick={onClickHandler}
      />,
    );
    fireEvent.press(screen.getByTestId('card-id-1'));
    await waitFor(() => {
      expect(onClickHandler).toHaveBeenCalledTimes(0);
      expect(screen.getByText('?')).toBeVisible();
    });
  });
});
