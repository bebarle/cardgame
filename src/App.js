/**
 * Card Memory Game
 */

import React from 'react';
import { SafeAreaView } from 'react-native';
import CardGame from './components/card-game';
import { baseStyle } from './base.style';

const CARD_PAIRS_VALUE = 6;
const App = () => {
  return (
    <SafeAreaView style={baseStyle.flexOne}>
      <CardGame pairs={CARD_PAIRS_VALUE} />
    </SafeAreaView>
  );
};

export default App;
