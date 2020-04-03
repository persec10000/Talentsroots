import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Text,
  Picker,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';

import Header from '../../commons/header';
import ReviewCard from '../../commons/reviewCard';
import DrawerWrapper from '../../commons/rightDrawerWrapper';
import config from '../../config';
import { my_reviews, awarded_reviews, pending_reviews } from '../../services/myReviews';
import { AirbnbRating } from 'react-native-ratings';

class MyReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myreviews: [],
      pendingReviews: [],
      awardedReviews: [],
      type: 'Received',
      loader: true
    };
  }
  componentDidMount = async () => {
    console.disableYellowBox = true;
    const response = await my_reviews(this.props.token);
    this.setState({ myreviews: response.data });
    console.log('Responseeeeee', response);
  };

  fetchReviews = async (item) => {
    if (item == 'awarded') {
      this.setState({type: item, myreviews: [], pendingReviews: []})
      response = await awarded_reviews(this.props.token)
      this.setState({awardedReviews: response.data})
      console.log("", response);

    } else if (item == 'received') {
      this.setState({type: item, awardedReviews: [], pendingReviews: []})
      response = await my_reviews(this.props.token)
      this.setState({ myreviews: response.data });
      console.log("", response);
    } else {
      this.setState({type: item, myreviews: [], awardedReviews: []})
      response = await pending_reviews(this.props.token)
      console.log("", response);
      this.setState({ awardedReviews: response.data });
    }
  }

  

  render() {
    return (
      <DrawerWrapper {...this.props}>
        <View style={{ flex: 1, padding: 20, alignItems: 'center' }}>
          <ScrollView style={styles.container}>
            <View style={styles.picker}>
              <Picker
                selectedValue={this.state.type}
                onValueChange={(itemValue, itemIndex) =>
                  this.fetchReviews(itemValue)
                }>
                <Picker.Item label="Received" value="received" />
                <Picker.Item label="Awarded" value="awarded" />
                <Picker.Item label="Pending" value="pending" />
              </Picker>
            </View>

            <View>
              {this.state.myreviews ? this.state.myreviews.map((item, index) => {
                return (
                  <View style={styles.cardView}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', alignContent: 'flex-start', padding: 10 }}>
                      <Text>From</Text>
                      <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={{ uri: item.profile }} />
                      <Text>{' '+item.name}</Text>
                    </View>
                    <View style={{ height: 1, width: Dimensions.get('window').width / 1.2, backgroundColor: '#748F9E', padding: 0 }}></View>
                    <View>
                      <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                        <Text style={styles.headText}>
                          Order:
                      </Text>
                        <Text style={styles.dataText}>
                          {' '+item.o_order_id}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                        <Text style={styles.headText}>
                          Review:
                      </Text>
                        <Text style={styles.dataText}>
                          {' '+item.messages}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                        <Text style={styles.headText}>
                          Rating:
                      </Text>
                        <AirbnbRating
                          selectedColor="#ffd700"
                          count={1}
                          showRating={false}
                          size={16}
                          defaultRating={(item.communication_level + item.quality_of_delivered_work + item.recommended_for_others) / 3}
                          isDisabled
                        />
                        <Text style={{color: '#ffd700'}}>({item.communication_level})</Text>
                      </View>
                      <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                        <Text style={styles.headText}>
                          Date:
                      </Text>
                        <Text style={styles.dataText}>
                          {' '+Date(item.or_created_at).slice(4, 16)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }) :
                <View style={styles.cardView}>
                  <Text style={{ textAlign: 'center', marginVertical: 10 }}>Nothing yet to show!</Text>
                </View>
              }
              {
                this.state.awardedReviews ? this.state.awardedReviews.map((item, index) => {
                  return (
                    <View style={styles.cardView}>
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start', alignContent: 'flex-start', padding: 10 }}>
                        <Text>From</Text>
                        <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={{ uri: item.profile }} />
                        <Text>{item.name}</Text>
                      </View>
                      <View style={{ height: 1, width: Dimensions.get('window').width / 1.2, backgroundColor: '#748F9E', padding: 0 }}></View>
                      <View>
                        <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                          <Text style={styles.headText}>
                            Order:
                        </Text>
                          <Text style={styles.dataText}>
                            {' '+item.o_order_id}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                          <Text style={styles.headText}>
                            Review:
                        </Text>
                          <Text style={styles.dataText}>
                            {' '+item.messages}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                          <Text style={styles.headText}>
                            Rating:
                        </Text>
                          <AirbnbRating
                            selectedColor="#ffd700"
                            count={1}
                            showRating={false}
                            size={16}
                            defaultRating={(item.communication_level + item.quality_of_delivered_work + item.recommended_for_others) / 3}
                            isDisabled
                          />
                          <Text style={{color: '#ffd700'}}>({item.communication_level})</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                          <Text style={styles.headText}>
                            Date:
                        </Text>
                          <Text style={styles.dataText}>
                            {' '+Date(item.or_created_at)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }) :
                  <View style={styles.cardView}>
                    <Text style={{ textAlign: 'center', marginVertical: 10 }}>Nothing yet to show!</Text>
                  </View>
              }
              {
                this.state.pendingReviews ? this.state.pendingReviews.map((item, index) => {
                  return (
                    <View style={styles.cardView}>
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start', alignContent: 'flex-start', padding: 10 }}>
                        <Text>From</Text>
                        <Image style={{ height: 50, width: 50, borderRadius: 50 }} source={{ uri: item.profile }} />
                        <Text>{item.name}</Text>
                      </View>
                      <View style={{ height: 1, width: Dimensions.get('window').width / 1.2, backgroundColor: '#748F9E', padding: 0 }}></View>
                      <View>
                        <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                          <Text style={styles.headText}>
                            Order:
                        </Text>
                          <Text style={styles.dataText}>
                            {' '+item.o_order_id}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                          <Text style={styles.headText}>
                            Review:
                        </Text>
                          <Text style={styles.dataText}>
                            {' '+item.messages}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                          <Text style={styles.headText}>
                            Rating:
                        </Text>
                          <AirbnbRating
                            selectedColor="#ffd700"
                            count={1}
                            showRating={false}
                            size={16}
                            defaultRating={(item.communication_level + item.quality_of_delivered_work + item.recommended_for_others) / 3}
                            isDisabled
                          />
                          <Text style={{color: '#ffd700'}}>({item.communication_level})</Text>
                        </View>
                        <View style={{ flexDirection: 'row', paddingLeft: 10 }}>
                          <Text style={styles.headText}>
                            Date:
                        </Text>
                          <Text style={styles.dataText}>
                            {' '+Date(item.or_created_at)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }) :
                  <View style={styles.cardView}>
                    <Text style={{ textAlign: 'center', marginVertical: 10 }}>Nothing yet to show!</Text>
                  </View>
              }
            </View>
          </ScrollView>
        </View>
      </DrawerWrapper>
    );
  }
}
const mapStateToProps = state => {
  return {
    token: state.LoginUser.userToken,
  };
};

const My_Reviews = connect(mapStateToProps, null)(MyReviews);
export default My_Reviews;

const styles = StyleSheet.create({
  reviewsContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  loadercontainer: {
    flex: 1,
    // marginTop: 300,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  picker: {
    height: 50,
    width: Dimensions.get('window').width / 1.2,
    borderWidth: 1,
    borderColor: '#748F9E',
    borderRadius: 50
  },
  cardView: {
    width: Dimensions.get('window').width / 1.2,
    borderColor: '#748F9E',
    borderWidth: 1,
    borderRadius: 15,
    marginVertical: 10
  },
  headText: {
    fontWeight: 'bold',
    color: '#748f9e'
  },
  dataText: {
    color: '#748f9e'
  }
});
