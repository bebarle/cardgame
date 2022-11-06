import { StyleSheet } from 'react-native';

const styles = (cardHeight) => {
  const cardStyle = {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1.5,
    borderRadius: 8,
    borderColor: 'rgba(249, 180, 45, 0.25)'
  };

  return StyleSheet.create({
    cardFlip: {
      width: '30%',
      height: cardHeight,
      marginLeft: 10,
    },
    card: {
      ...cardStyle
    },
    cardBack: {
      ...cardStyle,
      backgroundColor: 'rgba(249, 180, 45, 0.25)'
    },
  });
};

export default styles;