import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    PickerIOS,
    PickerItemIOS,
    TouchableHighlight,
    ScrollView,
    Alert
} from 'react-native';
import assets from '../style/assets'
import styles from '../style/style'
import Icon from 'react-native-vector-icons/Ionicons'
export default class Picker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    };
    
    componentWillMount(){
       
    }
    
    componentDidMount(){
    }
    
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
