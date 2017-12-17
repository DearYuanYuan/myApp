import React from 'react';
import {
  StyleSheet
} from 'react-native';
import fontsize from '../components/plug/fontSize'
const assets = StyleSheet.create({
    //list start
    assetsDetails:{
        backgroundColor: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomColor:'#eee',
        borderBottomWidth:0.5,
        paddingBottom: 10,
    },
    detailsView:{
        flexDirection:'row',
        alignItems: 'center',
    },
    detailTitle:{
        paddingTop: 10,
        paddingBottom: 10,
    },
    detailAssetsBar:{
        flex: 3,
        fontSize: fontsize(13),
        color:'#7F8A98',
        paddingTop: 8,
    },
    detailAssetsFile:{
        flexDirection:'row',
        backgroundColor: '#7F8A98',
        padding:3,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth:0,
    },
    AssetsFile:{
        color:'#fff',
        fontSize: fontsize(13),
    },
    detailsAssetsContent:{
        fontSize: fontsize(16),
        lineHeight:fontsize(24),
        marginBottom: 12,
    },
    detailAssetsUser:{
        flexDirection:'row',
        fontSize: fontsize(16),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:16,
    },
    assetsOwener:{
        flex: 1,
        fontSize: fontsize(15),
        color:'#7F8A98',
        paddingLeft: 10,
    },
    assetsTime:{
        flex: 2,
        textAlign: 'right',
        color:'#7F8A98',
        fontSize: fontsize(15),
    },
    userPhoto:{
        width: 30,
        height:30,
        borderRadius: 15,
    },
    //add assets
    addNewCover:{
        backgroundColor:'#fff',
        padding:20,
        height: 800,
    },
    addAssetsOptionBox:{
        marginBottom: 20,
    },
    createAssetsBtn:{
        alignItems: 'center',
        marginTop: 20,
    },
    addAssetsTitleFont:{
        fontSize: fontsize(13),
        marginBottom: 10,
        color: '#7F8A98',
    },
    addAssetsIpt:{
        backgroundColor: '#FFFFFF',
        borderColor: '#dedede',
        borderWidth:1,
        borderRadius: 6,
        height:100,
        lineHeight:fontsize(24),
        fontSize: fontsize(16),
        padding: 10,
    },
    addAssetsErr:{
        alignItems: 'center',
        marginBottom: 60,
    },
    fileNameBox:{
        // height: 40,
        backgroundColor: '#7F8A98',
        borderRadius: 6,
        marginBottom: 12,
    },
    fileNameText:{
        // lineHeight:30,
        marginTop: 8,
        marginBottom:8,
        color: '#FFFFFF',
        backgroundColor: '#7F8A98',
        fontSize: fontsize(15),
        paddingLeft: 10,
        borderRadius: 6,
    },
});
module.exports = assets;