import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ScrollView,
    Image,
} from 'react-native';
import SocketIOClient from 'socket.io-client/dist/socket.io';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';

class ChatIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            getMessage: false,
        }
    }

    componentDidMount = () => {
        socket = SocketIOClient('https://socket.tribital.ml?user_id=' + this.props.id);
        socket.on('connect', () => {
            console.log('connected at https://socket.tribital.ml?user_id=' + this.props.id)
        });

        socket.on('connect_error', (err) => { 
          //  console.log("SOCKET CONNECTION ERR ----", err)
         })

        socket.on('user_message', (data) => {
            const userMessage = JSON.parse(data)
            if(userMessage.type == "chat"){
                console.log("called")
                if (userMessage.type === "chat") {
                    this.setState({
                        getMessage: true
                    })
                }
            }
        })
    }

    render() {
        return (
            <TouchableOpacity onPress={() => { this.setState({ getMessage: false }) }}>
                <View style={this.state.getMessage ? styles.isMessage : styles.noMessage}>
                </View>
                <Image style={{ height: 22, width: 28 }} source={require("../assets/icons/mail.png")} />
            </TouchableOpacity>
        )
    }
}

const mapStateToProps = state => {
    return {
        token: state.LoginUser.userToken,
        review: state.addRoot,
        id: state.LoginUser.user_id
    };
};

const styles = StyleSheet.create({
    isMessage: {
        height: 10,
        width: 10,
        right: 0,
        top: 0,
        position: 'absolute',
        backgroundColor: 'red',
        zIndex: 100,
        borderRadius: 100
    },
    noMessage: {

    }
})

export default connect(mapStateToProps)(ChatIcon);