import React from 'react';
import {
    TouchableHighlight,
    Text,
    StyleSheet,
    Alert
} from 'react-native';
import fontsize from './plug/fontSize'
export default class TouchableButton extends React.Component {
    render() {
        return (
            <TouchableHighlight style={button.buttonCover} activeOpacity={1} underlayColor='#F28321'>
                <Text style={button.textMsg} onPress = {this.props.onButtonPress.bind(this)} suppressHighlighting={true}>{this.props.title}</Text>
            </TouchableHighlight>
        );
    }
}

const button = StyleSheet.create({
    buttonCover:{
        borderColor:'#F28321',
        borderWidth:1,
        borderRadius:4,
        marginBottom: 20,
    },
    textMsg: {
        color: '#fff',
        fontSize: fontsize(16),
        backgroundColor:'#F28321',
        width:300,
        height:40,
        lineHeight:42,
        textAlign:'center',
        borderRadius:4,
    },
});