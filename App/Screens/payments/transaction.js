/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TextInput,
    CheckBox,
    TouchableOpacity
} from 'react-native';
import { connect } from "react-redux";

import { transaction } from '../../services/payments/transaction'



class Transaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: []
        }
    }
    componentDidMount = async () => {
        console.disableYellowBox = true;
        const response = await transaction(this.props.token)
        this.setState({ transactions: response.data })
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', response)
    }
    render() {
        return (
            <ScrollView style={styles.container}>
                {this.state.transactions ? this.state.transactions.map((item, index) => {
                    return (
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('OrderDetails', { orderDetails: item }) }}>
                        <View style={styles.transaction_wrapper}>
                            {/* <View style={styles.transaction_detail}>
                    <Text style={styles.transaction_text}>{item.wlt_detail}</Text>
                    <Text style={styles.transaction_price}>{`${item.wlt_amount} $`}</Text>
                            </View>
                    <Text style={styles.transaction_date}>{Date(item.wlt_created_at)}</Text> */}
                    <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                        <Text style={styles.headText}>
                          Description:
                      </Text>
                        <Text style={styles.dataText}>
                          {' '+item.wlt_detail}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                        <Text style={styles.headText}>
                          Date:
                      </Text>
                        <Text style={styles.dataText}>
                          {' '+item.wlt_created_at}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                        <Text style={styles.headText}>
                          Amount:
                      </Text>
                        <Text style={styles.dataText}>
                          {' '+item.wlt_amount+'$'}
                        </Text>
                      </View>
                        </View>
                        </TouchableOpacity>
                    );
                }) : <Text style={styles.transaction_date}>No Transaction</Text>}
            </ScrollView>
        );
    }
};



const mapStateToProps = state => {
    return {
        token: state.LoginUser.userToken,
    };
};


const Transaction_Screen = connect(
    mapStateToProps,
    null,
)(Transaction);
export default Transaction_Screen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    transaction_wrapper: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 15,
        borderColor: '#EDF1F4',
        marginVertical: 10
    },
    transaction_detail: {
        flexDirection: "row",
        justifyContent: 'space-between',
        paddingBottom: 5
    },
    transaction_text: {
        color: '#2AABE4',
        fontSize: 12
    },
    transaction_price: {
        color: '#748F9E',
        fontSize: 12
    },
    transaction_date: {
        color: '#748F9E',
        fontSize: 12
    },
    headText: {
        fontWeight: 'bold',
        color: '#748f9e'
      },
      dataText: {
        color: '#748f9e',
        width: 200  
      },
});
