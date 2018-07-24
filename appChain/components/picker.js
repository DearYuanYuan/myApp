/*
    Picker ： app中的点击下拉框组件
    onPress ： this.props.showSelectPicker 点击显示/隐藏下拉框
    onPress ： this.props.pickerValue 点击下拉框选项
            需要传入选择项的id和name
    this.props.showPickerBox ：下拉框是否显示，需要父组件定义和修改
    this.props.selectOption : 下拉框组件表单内容
    this.props.pickerList：下拉框组件下拉列表内容数组
*/
import React from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    ScrollView,
} from 'react-native';
//css样式
import assets from '../style/assets'
//css样式
import styles from '../style/style'
//字体图标插件
import Icon from 'react-native-vector-icons/Ionicons'

export default class Picker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    };
    
    
    render() {
        return (
            <TouchableHighlight onPress={this.props.showSelectPicker.bind(this)} activeOpacity={1} underlayColor='#fff'>
            <View style={styles.pickerCover}>
                <View style={styles.pickerIconClick}>
                    <Text style={styles.pickerValue}  >{this.props.selectOption}</Text>
                    <Icon name='ios-arrow-down-outline' size={20}/>
                </View>
                {
                    this.props.showPickerBox &&
                    <ScrollView style={styles.pickerListCover}>
                    {
                        this.props.pickerList.map((data,index)=>{
                            return (
                                <Text key={index} style={styles.pickerList}
                                onPress={this.props.pickerValue.bind(this,data[this.props.dataName],data[this.props.dataKey])}>{data[this.props.dataName]}</Text>
                            )
                            
                        })
                    }
                    </ScrollView>
                }
                
                
            </View>
            
            </TouchableHighlight>
           
        );
    }
}
