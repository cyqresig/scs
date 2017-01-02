/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Linking,
} from 'react-native';


import constants from  '../constants/constant';

export default class OrderDetail extends Component {
    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.viewItem}>
                    <View style={{flex:3, flexDirection: 'row',justifyContent:'flex-start',}}>
                        <Text>单号:</Text>
                        <Text>{this.props.orderNum}</Text>
                    </View>
                    <View
                        style={{flex:1,justifyContent:'flex-end',paddingRight:constants.MarginLeftRight,}}>
                        <Text style={{color:constants.UIActiveColor}}>{this.props.rightText}</Text>
                    </View>
                </View>
                <View style={styles.line}/>
                <View style={styles.viewItem}>
                    <Text>发布时间:</Text>
                    <Text>{this.props.time}</Text>
                </View>
                <View style={styles.line}/>
                <View style={styles.viewItem}>
                    <Text>贸易条款:</Text>
                    <Text>{this.props.time}</Text>
                </View>
                <View style={styles.line}/>
                <View style={styles.viewItem}>
                    <Text>委托人:</Text>
                    <Text>用户名</Text>
                </View>
                <View style={styles.line}/>
                <View style={[styles.viewItem]}>
                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',}} onPress={()=>{

                    }}>
                        <Text style={{color:constants.UIActiveColor}}>修改</Text>

                    </TouchableOpacity>
                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',}} onPress={()=>{

                    }}>
                        <Text style={{color:constants.UIActiveColor}}>取消</Text>

                    </TouchableOpacity>
                </View>
                <View style={styles.line}/>
                <View style={styles.viewItem}>
                    <Text>联系方式:</Text>
                    <Text>13313313131</Text>
                </View>
                <View style={styles.line}/>
                <View style={styles.viewItem}>
                    <Text>出发国家:</Text>
                    <Text>日本</Text>
                </View>
                <View style={styles.line}/>
                <View style={styles.viewItem}>
                    <Text>目的国家:</Text>
                    <Text>中国</Text>
                </View>
                <View style={styles.line}/>
                <View style={[styles.viewItem,{flex:1},]}>
                    <Text>货代服务:</Text>
                    <Text >进口清关、需求国际物流、需求国内物流、出口国陆运</Text>
                </View>
                <View style={styles.line}/>
                <View style={styles.viewItem}>
                    <Text>支付方式:</Text>
                    <Text>信用证</Text>
                </View>
                <View style={styles.line}/>
                <View style={[styles.viewItem,{flex:1,}]}>
                    <Text>委托内容:</Text>
                    <Text style={{ fontStyle:'italic',}}>FOB模式,体积2立方米,5件运品,谢谢</Text>
                </View>
                <View style={[styles.line,{marginBottom:10}]}/>
                <TextInput
                    style={{flex:1,fontSize:15,textAlignVertical:'top',
                      margin:3,
                      borderTopWidth: StyleSheet.hairlineWidth,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderColor: constants.UIInActiveColor,
                      justifyContent:'flex-start',

                      }}
                    clearButtonMode="while-editing"
                    placeholder='拒绝原因'
                    maxLength={300}
                    underlineColorAndroid='transparent'
                    multiline={true}//多行输入
                    numberOfLines={6}
                />
                <View style={[styles.line,{marginBottom:10}]}/>
                <View style={[styles.viewItem]}>
                    <TouchableOpacity style={{flex:1,justifyContent:'center',alignItems:'center',}} onPress={()=>{
        //打电话
        return Linking.openURL(constants.Tel);
                    }}>
                        <Text style={{color:constants.UIActiveColor}}>联系客服</Text>

                    </TouchableOpacity>
                    <View style={[styles.line,{marginBottom:10}]}/>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,


        marginTop: Platform.OS == 'ios' ? 64 : 56,
        backgroundColor: constants.UIBackgroundColor,
    },
    viewItem: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: constants.MarginLeftRight,
    },
    line: {
        marginLeft: constants.MarginLeftRight,
        marginRight: constants.MarginLeftRight,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
    }

});