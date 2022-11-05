/**
 * 
 * MIT License
 * 
 * Copyright (c) 2018 
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { polyfill } from 'react-lifecycles-compat';

import { Platform, StyleSheet, Animated } from "react-native";

class CardFlip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            duration: 5000,
            side: 0,
            sides: [],
            progress: new Animated.Value(0),
            rotation: new Animated.ValueXY({ x: 50, y: 50 }),
            zoom: new Animated.Value(0),
            rotateOrientation: "",
            flipDirection: "y"
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.duration !== prevState.duration ||
            nextProps.flipZoom !== prevState.flipZoom ||
            nextProps.children !== prevState.sides) {
            return {
                duration: nextProps.duration,
                flipZoom: nextProps.flipZoom,
                sides: nextProps.children
            }
        }
        return null;
    }

    componentDidMount() {
        this.setState({
            duration: this.props.duration,
            flipZoom: this.props.flipZoom,
            sides: this.props.children
        });
    }

    flip() {
        if (this.props.flipDirection == "y") {
            this.flipY();
        } else {
            this.flipX();
        }
    }

    flipY() {
        const { side } = this.state;
        this._flipTo({
            x: 50,
            y: side === 0 ? 100 : 50
        });
        this.setState({
            side: side === 0 ? 1 : 0,
            rotateOrientation: "y"
        });
    }

    flipX() {
        const { side } = this.state;
        this._flipTo({
            y: 50,
            x: side === 0 ? 100 : 50
        });
        this.setState({
            side: (side === 0) ? 1 : 0,
            rotateOrientation: 'x',
        });
    }

    _flipTo(toValue) {
        const { duration, rotation, progress, zoom, side } = this.state;
        this.props.onFlip(side === 0 ? 1 : 0);
        this.props.onFlipStart(side === 0 ? 1 : 0);
        Animated.parallel([
            Animated.timing(progress, {
                toValue: side === 0 ? 100 : 0,
                duration,
                useNativeDriver: true
            }),
            Animated.sequence([
                Animated.timing(zoom, {
                    toValue: 100,
                    duration: duration / 2,
                    useNativeDriver: true
                }),
                Animated.timing(zoom, {
                    toValue: 0,
                    duration: duration / 2,
                    useNativeDriver: true
                })
            ]),
            Animated.timing(rotation, {
                toValue,
                duration: duration,
                useNativeDriver: true
            })
        ]).start(() => {
            this.props.onFlipEnd(side === 0 ? 1 : 0);
        });
    }

    getCardATransformation() {
        //0, 50, 100
        const { progress, rotation, side, rotateOrientation } = this.state;

        const sideAOpacity = progress.interpolate({
            inputRange: [50, 51],
            outputRange: [100, 0],
            extrapolate: "clamp"
        });

        const sideATransform = {
            opacity: sideAOpacity,
            zIndex: side === 0 ? 1 : 0,
            transform: [{ perspective: this.props.perspective }]
        };
        if (rotateOrientation === "x") {
            const aXRotation = rotation.x.interpolate({
                inputRange: [0, 50, 100, 150],
                outputRange: ["-180deg", "0deg", "180deg", "0deg"],
                extrapolate: "clamp"
            });
            sideATransform.transform.push({ rotateX: aXRotation });
        } else {
            // cardA Y-rotation
            const aYRotation = rotation.y.interpolate({
                inputRange: [0, 50, 100, 150],
                outputRange: ["-180deg", "0deg", "180deg", "0deg"],
                extrapolate: "clamp"
            });
            sideATransform.transform.push({ rotateY: aYRotation });
        }
        return sideATransform;
    }

    getCardBTransformation() {
        const { progress, rotation, side, rotateOrientation } = this.state;

        const sideBOpacity = progress.interpolate({
            inputRange: [50, 51],
            outputRange: [0, 100],
            extrapolate: "clamp"
        });

        const sideBTransform = {
            opacity: sideBOpacity,
            zIndex: side === 0 ? 0 : 1,
            transform: [{ perspective: -1 * this.props.perspective }]
        };
        let bYRotation;
        if (rotateOrientation === "x") {
            const bXRotation = rotation.x.interpolate({
                inputRange: [0, 50, 100, 150],
                outputRange: ["0deg", "-180deg", "-360deg", "180deg"],
                extrapolate: "clamp"
            });
            sideBTransform.transform.push({ rotateX: bXRotation });
        } else {
            if (Platform.OS === "ios") {
                // cardB Y-rotation
                bYRotation = rotation.y.interpolate({
                    inputRange: [0, 50, 100, 150],
                    outputRange: ["0deg", "180deg", "0deg", "-180deg"],
                    extrapolate: "clamp"
                });
            } else {
                // cardB Y-rotation
                bYRotation = rotation.y.interpolate({
                    inputRange: [0, 50, 100, 150],
                    outputRange: ["0deg", "-180deg", "0deg", "180deg"],
                    extrapolate: "clamp"
                });
            }
            sideBTransform.transform.push({ rotateY: bYRotation });
        }
        return sideBTransform;
    }

    render() {
        const { side, progress, rotateOrientation, zoom, sides } = this.state;
        const { flipZoom } = this.props;

        // Handle cardA transformation
        const cardATransform = this.getCardATransformation();

        // Handle cardB transformation
        const cardBTransform = this.getCardBTransformation();

        // Handle cardPopup
        const cardZoom = zoom.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 1 + flipZoom],
            extrapolate: "clamp"
        });

        const scaling = {
            transform: [{ scale: cardZoom }]
        };

        return (
            <Animated.View style={[this.props.style, scaling]}>
                <Animated.View style={[styles.cardContainer, cardATransform]}>
                    {sides[0]}
                </Animated.View>
                <Animated.View style={[styles.cardContainer, cardBTransform]}>
                    {sides[1]}
                </Animated.View>
            </Animated.View>
        );
    }
}
const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        top: 0
    }
});

CardFlip.defaultProps = {
    style: {},
    duration: 500,
    flipZoom: 0.09,
    flipDirection: "y",
    perspective: 800,
    onFlip: () => { },
    onFlipStart: () => { },
    onFlipEnd: () => { }
};

CardFlip.propTypes = {
    style: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.object,
        PropTypes.array
    ]),
    duration: PropTypes.number,
    flipZoom: PropTypes.number,
    flipDirection: PropTypes.string,
    onFlip: PropTypes.func,
    onFlipEnd: PropTypes.func,
    onFlipStart: PropTypes.func,
    perspective: PropTypes.number
};

polyfill(CardFlip)
export default CardFlip 