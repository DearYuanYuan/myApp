/*
  入口文件
  app中所有的界面都需要在app.js中注册
  若没有注册会发生未知错误
*/
import React, { Component } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  Image,
} from 'react-native';
import {StackNavigator,TabNavigator,TabBarBottom} from 'react-navigation'; 

/*
启动屏幕图片：
由于app启动需要加载资源，
头部会默认显示加载进程，
使用这个插件可以在app加载进程的时候一直显示启动图，
等到资源加载完成，启动图消失
*/
import SplashScreen from 'react-native-splash-screen' 
import $ from 'jquery'
//登录界面
import Login from './Login'
//资产列表首页
import Home from './Home'
//资产详情信息
import AssetsDetail from './AssetDetail' 
//选择转移资产的用户列表
import UserList from './UserList'
//资产交易历史
import AssetsHistory from './AssetsHistory'
//新建资产
import AddNewAssets from './AddNewAssets'
//转移资产
import TransAssets from './TransAssets'
//用户注册
import Register from './Register'
//用户信息修改
import Settingusermsg from './Settingusermsg'
//用户密码修改
import Settingpassword from './Settingpassword'
//搜索相关资产
import SearchAssets from './SearchAssets'

/*
  RN导航组件
  app中所有界面注册入口
*/

export const Navigator = StackNavigator(
  {
    Login:{ //登录
      screen:Login,
      navigationOptions:{
        header:null
      }
    },
    Register:{ //注册
      screen:Register,
      navigationOptions:{
      }
    },
    Home:{ //资产首页
      screen:Home,
      navigationOptions:{
        // header:null
      }
    },
    AssetsDetail:{ //单个资产详情页
      screen:AssetsDetail,
      navigationOptions:{

      }
    },
    SearchAssets:{ //搜索资产
      screen:SearchAssets,
      navigationOptions:{

      }
    },
    AssetsHistory:{ //资产交易历史
      screen:AssetsHistory,
      navigationOptions:{
        
      }
    },
    AddNewAssets:{//新增资产
      screen:AddNewAssets,
      navigationOptions:{
        
      }
    },
    TransAssets:{ //转移资产
      screen:TransAssets,
      navigationOptions:{

      }
    },
    UserList:{ //选择用户列表
      screen:UserList,
      navigationOptions:{

      }
    },
    Settingusermsg:{ //用户信息修改
      screen:Settingusermsg,
      navigationOptions:{
        
      }
    },
    Settingpassword:{ //修改密码
      screen:Settingpassword,
      navigationOptions:{
        
      }
    },
  },

  {navigationOptions:{  
    headerBackTitle:'返回', //默认导航返回文件
    headerTintColor:'#F28321', //文字颜色
    showIcon:true,  
    swipeEnabled:false,  
    animationEnabled:false,
  },  
})

/*
  项目注册组件App
*/

export default class App extends Component{
  
  componentDidMount(){
    SplashScreen.hide();//关闭启动屏幕
    
  }
  render() {
    return (
      <Navigator />
    );
  }
}


