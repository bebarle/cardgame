import React from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import CardFlip
  from "./card-flip";
const Card = props => {
  const { isVisible, onClick, id, value, enabled } = props;
  const cardRef = React.useRef();
  const sideRef = React.useRef(0);

  React.useEffect(() => {
    if (!isVisible && cardRef.current && sideRef.current === 1) {
      cardRef.current.flip();
    }

  }, [isVisible])

  const onCardClick = () => {
    if (enabled && !isVisible) {
      cardRef.current.flip();
    }
  }

  return (
    <CardFlip
      ref={(card) => cardRef.current = card}
      style={{ width: 100, height: 100 }}
      onFlipEnd={(side) => {
        sideRef.current = side;
        if (side === 1) {
          onClick();
        }
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.card, { backgroundColor: 'rgba(249, 180, 45, 0.25)' }]}
        onPress={() => {
          onCardClick();
        }}>
        <Text>?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          onCardClick();
        }}
        style={styles.card}
      >
        <Text>{value}</Text>
      </TouchableOpacity>
    </CardFlip >
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderWidth: 1.5,
    borderColor: "#fff",
  }
});

export default Card;
