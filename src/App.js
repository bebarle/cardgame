/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Grid from 'components/grid';
import { generateList, getItem } from './util/list';

const CARD_PAIRS_VALUE = 6;
const App = () => {
  const [newGame, setNewGame] = React.useState(false);
  const [list, setList] = React.useState(generateList(CARD_PAIRS_VALUE));
  const [visibleItems, setVisibleItems] = React.useState([]);
  const [finishedItems, setFinishedItems] = React.useState([]);
  const [winner, setWinner] = React.useState(false);
  const [step, setStep] = React.useState(0);

  const createNewList = () => {
    setList(generateList(CARD_PAIRS_VALUE));
  };

  const notEqual = () => {
    setTimeout(() => {
      setVisibleItems([]);
    }, 1000);
  };

  const checkItems = (firstIndex, secondIndex) => {
    const firstItem = getItem(list, firstIndex);
    const secondItem = getItem(list, secondIndex);
    if (!firstItem || !secondItem) {
      notEqual();
    } else {
      if (
        firstIndex !== secondIndex &&
        firstItem.value === secondItem.value
      ) {
        setFinishedItems([...finishedItems, firstItem.id, secondItem.id]);
        setVisibleItems([]);
      } else {
        notEqual();
      }
    }
  };

  React.useEffect(() => {
    if (finishedItems.length > 0 && finishedItems.length === list.length) {
      setWinner(true);
    }
  }, [finishedItems]);

  return (
    <SafeAreaView style={styles.defaultStyle}>
      <View>
        <View style={styles.topBarStyle}>
          <Button
            style={[styles.defaultStyle, { alignSelf: 'flex-start' }]}
            onPress={() => {
              setNewGame(!newGame);
              setVisibleItems([]);
              setFinishedItems([]);
              setWinner(false);
              createNewList();
            }}
            title="RESTART"
          />
          <Text style={[{ justifyContent: 'center' }]}>STEP: {step}</Text>
        </View>
      </View>
      <View style={styles.defaultStyle}>
        <Grid
          list={list}
          visibleItems={visibleItems}
          setVisibleItems={setVisibleItems}
          finishedItems={finishedItems}
          checkItems={checkItems}
        />
        {winner && <Text>You Win!</Text>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topBarStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 5
  },
  defaultStyle: {
    flex: 1,
  }
});

export default App;
