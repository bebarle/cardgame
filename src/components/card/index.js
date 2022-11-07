import React from 'react';
import { TouchableOpacity, useWindowDimensions, Text } from 'react-native';
import styles from './index.style';
import Flip, { CARD_SIDES } from './flip';

const Card = props => {
  const { isVisible, onClick, value, enabled, cols } = props;
  const cardRef = React.useRef();
  const sideRef = React.useRef(CARD_SIDES.BACK);

  const { width } = useWindowDimensions();

  const cardWidth = Math.min(width / 3);
  const cardHeight = cardWidth * 1.3;
  const cardStyles = styles(cardHeight, cols);

  React.useEffect(() => {
    if (!isVisible && cardRef.current && sideRef.current === CARD_SIDES.FRONT) {
      cardRef.current.flip();
    }
  }, [isVisible]);

  const onCardClick = () => {
    if (enabled && !isVisible) {
      cardRef.current.flip();
    }
  };

  return (
    <Flip
      ref={card => (cardRef.current = card)}
      style={cardStyles.cardFlip}
      onFlipEnd={side => {
        sideRef.current = side;
        if (side === CARD_SIDES.FRONT) {
          onClick();
        }
      }}>
      <TouchableOpacity
        activeOpacity={1}
        style={cardStyles.cardBack}
        onPress={() => {
          onCardClick();
        }}>
        <Text>?</Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={1} style={cardStyles.card}>
        <Text>{value}</Text>
      </TouchableOpacity>
    </Flip>
  );
};

export default Card;
