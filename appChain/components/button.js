/*
    项目中公用的按钮组件
        需要传入父组件点击事件和按钮文件

*/
import React from 'react';
import {
    TouchableHighlight,
    Text,
    StyleSheet,
    Alert
} from 'react-native';
//引入字体自适应文件
//由于iphone屏幕尺寸不同，需要根据尺寸调整字体大小
import fontsize from './plug/fontSize'
/*
TouchableButton 是app中的按钮组件
onPress：按钮被点击触发事件
*/
export default class TouchableButton extends React.Component {
    render() {
        return (
            <TouchableHighlight style={button.buttonCover} activeOpacity={1} underlayColor='#F28321'>
                <Text style={button.textMsg} onPress = {this.props.onButtonPress.bind(this)} suppressHighlighting={true}>{this.props.title}</Text>
            </TouchableHighlight>
        );
    }
}
//单独的按钮样式
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
