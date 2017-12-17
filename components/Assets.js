import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableHighlight,
    Alert
} from 'react-native';
import assets from '../style/assets'
import Icon from 'react-native-vector-icons/Ionicons'
let fentchUrl = 'http://139.196.253.89:8080'
export default class AssetsList extends React.Component {
    
    render() {
        return (
            <View>
                {
                this.props.assetsListData && 
                    this.props.assetsListData.map((data,index)=>{
                        return(
                            <TouchableHighlight style={assets.assetsContent} key={index} 
                                onPress = {this.props.showDealHistory.bind(this,data.asset,data.type,data.username,data.filename,data.time,data.asset_id,data.tx_id,data.enable_trans,data.photo,data.job)} activeOpacity={1}> 
                                <View style={assets.assetsDetails}>
                                <View style={[assets.detailsView,assets.detailTitle]}>
                                    <Text style={assets.detailAssetsBar}>资产内容</Text>
                                    <View style={assets.detailAssetsFile}>
                                            <Icon name='ios-link' size={14}/> 
                                            <Text style={assets.AssetsFile}>{data.filename==''?' 暂无附件':' 一个附件'}</Text>
                                        </View>
                                    
                                    
                                </View>
                                <Text style={assets.detailsAssetsContent} numberOfLines={2}>{data.asset}</Text>
                                <View style={assets.detailsView}>
                                    <Image style={assets.userPhoto}
                                        source={data.photo==null?require('../image/Avatar.png'):{uri:fentchUrl+data.photo}}>
                                    </Image>
                                    <Text style={assets.assetsOwener}>{data.username}</Text>
                                    <Text style={assets.assetsTime}>{data.time}</Text>
                                </View>
                                </View>
                            </TouchableHighlight>
                        )
                    })
                }
            </View>
           
            
        );
    }
}

