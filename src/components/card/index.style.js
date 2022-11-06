import { StyleSheet } from 'react-native';

const styles = (cardHeight, cols) => {
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
      flex: (1 / cols),
      height: cardHeight,
      marginHorizontal: 4
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