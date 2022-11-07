import React from 'react';
import { Alert, Button, Text, View } from 'react-native';
import Grid from 'components/grid';
import { generateList, getItem } from '../../util/list';
import styles from './index.style';
import { baseStyle } from '../../base.style';

const CardGame = props => {
  const { pairs } = props;

  const [newGame, setNewGame] = React.useState(false);
  const [list, setList] = React.useState(generateList(pairs));
  const [visibleItems, setVisibleItems] = React.useState([]);
  const [finishedItems, setFinishedItems] = React.useState([]);
  const [winner, setWinner] = React.useState(false);
  const [step, setStep] = React.useState(0);

  const createNewList = () => {
    setList(generateList(pairs));
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
      if (firstIndex !== secondIndex && firstItem.value === secondItem.value) {
        setFinishedItems([...finishedItems, firstItem.id, secondItem.id]);
        setVisibleItems([]);
      } else {
        notEqual();
      }
    }
  };

  const restart = () => {
    setNewGame(!newGame);
    setVisibleItems([]);
    setFinishedItems([]);
    setWinner(false);
    createNewList();
    setStep(0);
  };

  React.useEffect(() => {
    if (step > 0) {
      if (finishedItems.length > 0 && finishedItems.length === list.length) {
        setWinner(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  React.useEffect(() => {
    if (winner) {
      Alert.alert('Congratulations', `You won this game by ${step} steps`, [
        {
          text: 'Try another round',
          onPress: () => {
            restart();
          },
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [winner]);

  return (
    <View style={baseStyle.flexOne}>
      <View>
        <View style={styles.topBarStyle}>
          <Button
            style={[styles.restart]}
            onPress={() => {
              restart();
            }}
            title="RESTART"
          />
          <Text style={styles.steps}>STEPS: {step}</Text>
        </View>
      </View>
      <View style={baseStyle.flexOne}>
        <Grid
          list={list}
          visibleItems={visibleItems}
          setVisibleItems={setVisibleItems}
          finishedItems={finishedItems}
          checkItems={checkItems}
          addStep={() => {
            setStep(prev => {
              return prev + 1;
            });
          }}
        />
      </View>
    </View>
  );
};

export default CardGame;
