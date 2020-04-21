import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
  NativeModules,
  Linking,
  RefreshControl
} from 'react-native';
import { Button, Fab } from 'native-base';
import styles from './paymentScreen.styles';
import DrawerWrapper from '../../commons/rightDrawerWrapper';
import PayPal from 'react-native-paypal-wrapper';
import { orderSuccess } from '../../services/order';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import { getUserBalance } from '../../services/home/index'
import { getPaymentHTML } from '../../services/payments/payments'
import { TouchableOpacity } from 'react-native-gesture-handler';


const PaymentScreen = (props) => {

  console.log('payment screen', props)
  const [couponCode, setCouponCode] = useState('');
  const passedRootDetails = props.navigation.state.params.rootDetails;
  const [hyperPay, setHyperPay] = useState(false);
  const [checkoutId, setCheckoutId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0)
  const [html, setHtml] = useState('');

  console.log('passedRootDetails',passedRootDetails)

  const getUserBalanceDetails = async () => {
    let balance = await getUserBalance(props.token)
    console.log("balance", balance)
    setBalance(balance.data);
    setIsLoading(false)
  }

  const getHTML = async () => {
    console.log("===========================<<<<<<<<<<<<<<<<<<")
    let html = await getPaymentHTML(
      props.token,
      passedRootDetails.r_user_id,
      passedRootDetails.delivery_days,
      passedRootDetails.final_price,
      passedRootDetails.used_balance,
      passedRootDetails.processing_fees,
      passedRootDetails.r_id,
      passedRootDetails.orderId,
      passedRootDetails.packagePrice
    )
    setHtml(html);
  }

  useEffect(() => {
    setIsLoading(true)
    getUserBalanceDetails()
    getHTML()
  }, []);


  const payWithPaypal = () => {
    console.log("=====> in paypal integration <=====", passedRootDetails.final_price, props.id)
    PayPal.initialize(PayPal.SANDBOX, "AQD8sL1GHiTwqvf0v17w9H7EdUkbRhP3nXeVNcDjFs6dL-B3YJKtUIJkMi5G2OOMwKbytVZYVSqKyigD");
    PayPal.pay({
      price: passedRootDetails.final_price.toString(),
      currency: 'USD',
      description: 'Pay securely with talentsroot',
    }).then(confirm => {
      orderSuccess(
        passedRootDetails.r_user_id,
        props.id,
        passedRootDetails.r_id,
        passedRootDetails.final_price,
        passedRootDetails.used_balance,
        passedRootDetails.processing_fees,
        passedRootDetails.days,
        passedRootDetails.delivery_days,
        passedRootDetails.delivery_price,
        passedRootDetails.revision_days,
        passedRootDetails.revision_price,
        props.token)
        .then((orderSuccess) => {
          console.log("+++++++++++", orderSuccess)
          return props.navigation.navigate('Details', {
            orderDetails: {
              o_id: passedRootDetails.orderId,
              o_seller_id: passedRootDetails.r_user_id,
              o_buyer_id: props.id 
            }
          })
        })
        .catch((err) => {
          return Alert.alert(
            'Payment',
            'Something went wrong please try again later',
            [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              { text: 'OK', onPress: () => console.log('OK Pressed', err) },
            ],
            { cancelable: false },
          );
        })
    })
      .catch(error => console.log(error));
  }

  const checkUrlState = (url) => {
    console.log("======>>>>>>", url)
    if (url.includes('https://www.talentsroot.com/order/return')) {
      setHyperPay(false)
      props.navigation.navigate('OrderDetails', { orderDetails: item })
    }
  }

  const orderNow = async () => {
    let res = await orderSuccess(
      passedRootDetails.r_user_id,
      props.id,
      passedRootDetails.r_id,
      passedRootDetails.final_price,
      passedRootDetails.used_balance,
      passedRootDetails.processing_fees,
      passedRootDetails.days,
      passedRootDetails.delivery_days,
      passedRootDetails.delivery_price,
      passedRootDetails.revision_days,
      passedRootDetails.revision_price,
      props.token)
    if (res.status == 1) {
      Alert.alert('Order created successfully')
    } else {
      Alert.alert("Something went wrong Please try again later")
    }
  }


  return (
    <>{
      hyperPay ?
        <WebView
          source={{html: html}}
          onNavigationStateChange={state => checkUrlState(state.url)}
          style={{flex: 1}}
        />
        :
        <DrawerWrapper {...props}>
          <ScrollView
             refreshControl={ 
              <RefreshControl refreshing={isLoading} />
            }
          >
            {
              !isLoading ? 
              <>
                 <View style={styles.cardStyle}>
                  <View style={styles.ImageViewStyle}>
                    <Image
                      style={styles.ImageStyle}
                      resizeMode={'contain'}
                      source={{uri:passedRootDetails.r_image}}
                    />
                  </View>
                  <View style={{flexDirection: 'row' }}>
                    <View style={{ flex: 4 }}>
                      <Text style={styles.CardTitleStyle}>
                        {passedRootDetails.r_title}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.PriceStyle}>
                        ${passedRootDetails.final_price}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.profileViewStyle} >
                    <View style={styles.profileLeftViewStyle} >
                      <Image
                        style={styles.profileLeftViewImageStyle}
                        source={{ uri: passedRootDetails.r_image }}
                      />
                      <Text style={styles.profileLeftViewNameStyle}>
                        {passedRootDetails.username}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.orderIdTextStyle}>
                      Order #{passedRootDetails.orderId}
                  </Text>
                  <View style={styles.doshline} />
                  <View style={styles.tableItem} >
                    <Text style={styles.tableItemTitle}>Delivery days:</Text>
                    <View style={styles.tableItemRightSide}>
                      <Text style={styles.tableItemRightText}>{passedRootDetails.delivery_days} days</Text>
                    </View>
                  </View>
                  {
                    passedRootDetails.used_balance !== 0 ?
                    <>
                    <View style={styles.doshline} />
                    <View style={styles.tableItem} >
                      <Text style={[styles.tableItemTitle, { fontWeight: 'bold' }]}>Balance:</Text>
                      <View style={styles.tableItemRightSide}>
                        <Text style={styles.tableItemRightText}>${passedRootDetails.used_balance}</Text>
                      </View>
                    </View>
                    </> : null
                  }
                  <View style={styles.doshline} />
                  <View style={styles.tableItem} >
                    <Text style={styles.tableItemTitle}>Processing Fees (%):</Text>
                    <View style={styles.tableItemRightSide}>
                      <Text style={styles.tableItemRightText}>{passedRootDetails.processing_fees}</Text>
                    </View>
                  </View>
                  <View style={styles.doshline} />
                  <View style={styles.tableItem} >
                    <Text style={[styles.tableItemTitle, { fontWeight: 'bold' }]}>Total:</Text>
                    <View style={styles.tableItemRightSide}>
                      <Text style={styles.totalText}>${passedRootDetails.total}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.couponViewStyle}>
                  <TextInput
                    style={styles.couponTextInputStyle}
                    onChangeText={text => setCouponCode(text)}
                    value={couponCode}
                    placeholder='Coupon Code'
                  />
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>
                      APPLY COUPON
                    </Text>
                  </TouchableOpacity>
                </View>
                <Image
                  style={styles.securityImageStyle}
                  resizeMode={'contain'}
                  source={require('../../assets/images/secureText.png')}
                />
                {
                  passedRootDetails.final_price > balance ?
                    <View style={{ justifyContent: 'center', display: 'flex', alignContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                      <TouchableOpacity success style={styles.paymentsButton} onPress={() => payWithPaypal()}>
                        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                          <View style={[styles.cardView]}>
                            <Image resizeMode={'contain'} source={{ uri: "https://cdn.talentsroot.com/image/Paypal.png" }} style={{ height: 20, width: 150, padding: 25 }} />
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity primary style={styles.paymentsButton} onPress={() => { setHyperPay(true) }}>
                        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                          <View style={[styles.cardView]}>
                            <Image resizeMode={'contain'} source={{ uri: "https://cdn.talentsroot.com/image/paynow.png" }} style={{ height: 20, width: 150, padding: 25 }} />
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity primary style={styles.paymentsButton} onPress={() => { setHyperPay(true) }}>
                        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                          <View style={[styles.cardView]}>
                            <Image resizeMode={'contain'} source={{ uri: "https://cdn.talentsroot.com/image/CASHU.png" }} style={{ height: 20, width: 150, padding: 25 }} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                    :
                    <TouchableOpacity onPress={() => orderNow()}>
                      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                        <View style={[styles.cardView]}>
                          <Text style={[styles.transaction_date, { padding: 20, marginTop: 0, fontSize: 20, textAlign: 'center' }]}>Order Now</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                }
              </>
              :null
            }
          </ScrollView>
        </DrawerWrapper>
    }</>);
}
const mapStateToProps = state => {
  return {
    token: state.LoginUser.userToken,
    id: state.LoginUser.user_id,
    review: state.addRoot,
  };
};



export default connect(mapStateToProps)(PaymentScreen);
