import React, { useState } from 'react';
import { View, Dimensions } from 'react-native';
import Card from './card';

const Grid = props => {
  const { visibleItems, setVisibleItems, finishedItems, checkItems, list } = props;
  const windowWidth = Dimensions.get('window').width;

  return (
    <View style={{
      marginHorizontal: "auto",
      width: 400,
      flexDirection: "row",
      flexWrap: "wrap",
    }}>
      {list.map((item) => {
        const index = item.id
        return (
          <Card
            key={item.id}
            isVisible={finishedItems.includes(index) || visibleItems.includes(index)}
            enabled={visibleItems.length < 2}
            onClick={() => {
              if (!finishedItems.includes(index)) {
                switch (visibleItems.length) {
                  case 0:
                    setVisibleItems([index]);
                    break;
                  case 1:
                    if (visibleItems[0] !== index) {
                      setVisibleItems(visibleItems.concat(index));
                      checkItems(visibleItems[0], index);
                    }
                    break;
                  default:
                    setVisibleItems([]);
                }
              }
            }}
            value={item.value}
          />
        );
      })}
    </View>
  );
};

Grid.defaultProps = {
  list: [],
};

export default Grid;
