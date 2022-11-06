import React from 'react';
import { FlatList, View } from 'react-native';
import Card from '../card';
import styles from './index.style';

const NUM_OF_COL = 3;

const Grid = props => {
  const {
    visibleItems,
    setVisibleItems,
    finishedItems,
    checkItems,
    list,
    addStep
  } = props;

  const isEnabled = () => {
    return visibleItems.length < 2;
  }

  return (
    <FlatList
      numColumns={NUM_OF_COL}
      data={list}
      ItemSeparatorComponent={<View style={styles.separator} />}
      renderItem={cardItem => {
        const { item } = cardItem;
        const index = item.id
        return (
          <Card
            key={item.id}
            isVisible={finishedItems.includes(index) || visibleItems.includes(index)}
            enabled={isEnabled()}
            value={item.value}
            onClick={() => {
              if (!finishedItems.includes(index)) {
                switch (visibleItems.length) {
                  case 0:
                    setVisibleItems([index]);
                    addStep()
                    break;
                  case 1:
                    if (visibleItems[0] !== index) {
                      setVisibleItems(visibleItems.concat(index));
                      checkItems(visibleItems[0], index);
                      addStep()
                    }
                    break;
                  default:
                }
              }
            }}
          />
        );
      }}
    />
  );
};

Grid.defaultProps = {
  list: [],
  visibleItems: [],
  finishedItems: [],
  checkItems: () => { }
};

export default Grid;
