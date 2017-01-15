/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ActivityIndicator,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    Platform,
    NativeAppEventEmitter,
    TouchableOpacity,
} from 'react-native';


import constants from  '../constants/constant';
import Button from 'react-native-smart-button';
import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式

import XhrEnhance from '../lib/XhrEnhance' //http
//import { sysInfo_feedBack,errorXhrMock } from '../mock/xhr-mock'   //mock data

import {getDeviceID,getToken} from '../lib/User'
import Toast from 'react-native-smart-toast'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'
let firstDataList = []
/*let firstDataList = [{
    status_name: 'status_name',// 物流状态名称

    time_name: 'status_name',//  时间名称

    create_time_str: '1991-00-22 00:22:21',//  时间

    box_no: 'status_name',// 箱号

    //seal_no 铅封号

},{
    status_name: 'status_name',// 物流状态名称

    time_name: 'status_name',//  时间名称

    create_time_str: '1991-00-22 00:22:21',//  时间

    //box_no: 'status_name',// 箱号

    seal_no:'seal_no' //铅封号

},{
    status_name: 'status_name',// 物流状态名称

    time_name: 'status_name',//  时间名称

    create_time_str: '1991-00-22 00:22:21',//  时间

    //box_no: 'status_name',// 箱号

    //seal_no:'seal_no' //铅封号

},{
    status_name: 'status_name',// 物流状态名称

    time_name: 'status_name',//  时间名称

    create_time_str: '1991-00-22 00:22:21',//  时间

    //box_no: 'status_name',// 箱号

    //seal_no:'seal_no' //铅封号

}]*/
class Logistics extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            dataList: firstDataList,

            service_id: this.props.service_id,

        };
    }

    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('willfocus', (event) => {
                console.log(`orderPage willfocus...`)
                console.log(`currentRoute`, currentRoute)
                //console.log(`event.data.route`, event.data.route)
                if (event && currentRoute === event.data.route) {
                    console.log("orderPage willAppear")
                    NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
                } else {
                    console.log("orderPage willDisappear, other willAppear")
                }
                //
            })
        )
    }

    componentDidMount() {
        this._fetch_logistics()
    }

    /*
     status_name 物流状态名称

     time_name 时间名称

     create_time_str 时间

     box_no 箱号

     seal_no 铅封号

     num 总件数

     weight 总毛重

     volume 总体积

     vessel 船名

     . voyage 航次

     . bill_no 提单号

     . contianer_list 箱号列表*/
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.line}>
                    <Icon
                        name='ios-radio-button-on'
                        color={this.state.dataList.length==1?constants.UIActiveColor:constants.UIInActiveColor}
                        size={12}/>
                    {this.state.dataList.map((data, index)=> {
                        if (index==this.state.dataList.length - 1) {
                            return null
                        }
                        else {
                            return (
                                <View style={{justifyContent:'flex-start',alignItems:'center'}}>
                                    <View style={{width:2,height:55,marginTop:5,marginBottom:5,
                                        backgroundColor:constants.UIInActiveColor}}/>
                                    <Icon
                                        name='ios-radio-button-on'
                                        color={index==this.state.dataList.length-2?
                                        constants.UIActiveColor:constants.UIInActiveColor}
                                        size={12}/>
                                </View>
                            )
                        }
                    })

                    }
                </View>
                <View style={styles.tab}>
                    {this.state.dataList.map((data, index)=> {
                        return (
                            <View style={{height:60,flexDirection:'column',paddingTop:5,paddingBottom:5,
                            alignItems:'stretch',backgroundColor:'white', marginTop: 15,marginRight:10}}>
                                <Text fonsSize={16} style={[{fontWeight:'bold'},index==this.state.dataList.length-1?
                                {color:constants.UIActiveColor}:{color:'black'}]}>{data.status_name}</Text>
                                <View style={{flex:1,flexDirection:'row',}}>
                                    <Text >{data.time_name}</Text>
                                    <Text style={{flex:1}} numberOfLines={1}>{data.create_time_str}</Text>
                                    <Text style={data.box_no||data.seal_no?{}:{width:0}}>{data.box_no ? '箱号' : '铅封号'}</Text>
                                    <Text style={[{flex:1},data.box_no||data.seal_no?{}:{width:0}]}
                                          numberOfLines={1}>{data.box_no ? data.box_no : data.seal_no}</Text>
                                </View>
                            </View>)
                        })
                    }
                </View>
            </View>

        )
    }

    async _fetch_logistics() {
        try {
            let token = await getToken()
            let deviceID = await getDeviceID()
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.LogisticsLog,
                    service_id: this.state.service_id,
                    deviceId: deviceID,
                    token: token,
                }
            }

            options.data = await this.gZip(options)

            console.log(`_fetch_sendCode options:`, options)

            let resultData = await this.fetch(options)

            let result = await this.gunZip(resultData)

            result = JSON.parse(result)
            console.log('gunZip:', result)
            if (result.code && result.code == -54) {
                /**
                 * 发送事件去登录
                 */
                NativeAppEventEmitter.emit('getMsg_202_code_need_login');
                return
            }
            if (result.code && result.code == 10) {
                /* Alert.alert('提示', '注册成功', () => {
                 this.props.navigator.popToTop()
                 })*/
                let DataList = result.result
                this.setState({
                    dataList: DataList,
                })
            } else {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
            }


        }
        catch (error) {
            console.log(error)


        }
        finally {
            this.button2.setState({
                loading: false,
                //disabled: false
            })
            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS == 'ios' ? 64 : 56,
        flexDirection: 'row',
        alignItems: 'stretch',
        backgroundColor: constants.UIBackgroundColor,
    },
    line: {
        width: 20,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: constants.UIBackgroundColor,
        justifyContent: 'flex-start',
        paddingTop: 35,

    },
    tab: {
        flex: 1,

        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },

});

const navigationBarRouteMapper = {

    LeftButton: function (route, navigator, index, navState) {
        if (index === 0) {
            return null;
        }

        var previousRoute = navState.routeStack[index - 1];
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}
                style={navigatorStyle.navBarLeftButton}>
                <View style={navigatorStyle.navBarLeftButtonAndroid}>
                    <Icon
                        style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText,{fontSize: 20,}]}
                        name={'ios-arrow-back'}
                        size={constants.IconSize}
                        color={'white'}/>
                </View>
            </TouchableOpacity>

        );
    },

    RightButton: function (route, navigator, index, navState) {

    },

    Title: function (route, navigator, index, navState) {
        return (
            Platform.OS == 'ios' ?
                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                    {route.title}
                </Text> : <View style={navigatorStyle.navBarTitleAndroid}>
                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                    {route.title}
                </Text>
            </View>
        )
    },

}

export default AppEventListenerEnhance(XhrEnhance(Logistics))