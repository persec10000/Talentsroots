import React, { Fragment, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  CheckBox,
  Image,
  Alert
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { withdrawMoney } from '../../services/payments/payments'
import { connect } from 'react-redux';

const Withdraw = (props) => {

  const [email, setemail] = useState(props.profileData.email ? props.profileData.email : '')
  const [amount, setAmount] = useState('')
  const [payPal, setPayPal] = useState(false)
  const [cashu, setCashu] = useState(false)

  const withdraw = async() => {
    if(email == ''){
      Alert.alert("Please enter Email Address")

    }else if(amount < 15){
      Alert.alert("The amount must be higher than $15")
    }else{
      let response = await withdrawMoney(props.token, cashu ? 2 : 1, email, amount)
      return Alert.alert(
        '',
        response.message,
        [
            { text: 'OK', onPress: () => console.log("") },
        ],
        { cancelable: false },
    );
    }
  }


  return (
    <ScrollView style={styles.container}>
      <View style={styles.button}>
        <CheckBox
        value={payPal}
        onValueChange={() => setPayPal(!payPal)} />
        <Image style={{ marginLeft: 30, height: 30, width: 60 }} source={require('../../assets/icons/paypal.png')} />
      </View>
      <View style={styles.button}>
        <CheckBox 
        value={cashu}
        onValueChange={() => setCashu(!cashu)}/>
        <Image style={{ marginLeft: 30, height: 30, width: 60 }} resizeMode={'contain'} source={require('../../assets/icons/cashu.png')} />
      </View>
      <TextInput
        style={styles.textInput}
        placeholder={email}
        onChangeText={(text) => { setemail(text) }}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Amount"
        onChangeText={(text) => { setAmount(text) }}
      />
      <TouchableOpacity onPress={()=>withdraw()}>
      <View style={styles.withdrawButton}>
        <Text style={styles.withdrawText}>Withdraw</Text>
      </View>
      </TouchableOpacity>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const mapStateToProps = state => {
  return {
    token: state.LoginUser.userToken,
    profileData: state.userProfile.profiledata,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  button: {
    borderWidth: 1,
    borderColor: '#E8EEF1',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    marginVertical: 10
  },
  buttonText: {
    textAlign: 'center'
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E8EEF1',
    padding: 15,
    marginVertical: 10
  },
  withdrawButton: {
    backgroundColor: '#10A2EF',
    padding: 15,
    width: '50%',
    alignSelf: 'center',
    borderRadius: 10
  },
  withdrawText: {
    color: '#fff',
    textAlign: 'center'
  }
});
export default connect (mapStateToProps)(Withdraw)
