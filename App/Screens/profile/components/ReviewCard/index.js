import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TouchableHighlight, FlatList, TouchableOpacity } from 'react-native';
import HTML from 'react-native-render-html';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const SCREEN_WIDTH = Dimensions.get('window').width;
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import { Button } from 'native-base';
import { Rating, CheckBox, Badge } from 'react-native-elements';
import styles from './index.style';
import ProgressCircle from 'react-native-progress-circle'

const ReviewCard = props => {

    const { data , myReviews , ratings } = props;
 
    const RatingWithCount = ({ rating }) => {
        return (
            <Rating
                readonly
                imageSize={15}
                style={{ alignSelf: 'center', paddingLeft: 10 }}
                startingValue={rating}
            />
        )
    }

    console.log('myReviews ============',myReviews)

    return (
        <>
        {/*Reviews Section*/}
        {
            myReviews.length > 0 ? 
            <>
            <View style={styles.card}>
                <View style={styles.reviewSectionViewStyle}>
                    <View style={styles.reviewSectionHeaderViewStyle}>
                        <View style={styles.reviewSectionHeaderTitleViewStyle}>
                            <Text style={styles.description}>Reviews</Text>
                            {
                                ratings.reviews[0] && ratings.reviews[0].rating !== undefined && ratings.reviews[0].r_rating_count !== undefined ? 
                                <>
                                <Rating
                                    readonly
                                    imageSize={25}
                                    style={{ alignSelf: 'center', paddingLeft: 10 }}
                                    startingValue={ratings.reviews[0].rating}
                                /> 
                                <Text style={{ fontSize: 15, paddingLeft: 10 }}>{`(${ratings.reviews[0].r_rating_count})`}</Text>
                                </>
                                : null
                            }
                        </View>
                        <View style={styles.reviewSectionHeaderSubtitleViewStyle}>
                            <Text style={styles.reviewSectionHeaderSubtitleTextStyle}>
                                COMMUNICATION LEVEL
                            </Text>
                            <RatingWithCount rating={ratings.communication_level} />
                        </View>
                        <View style={styles.reviewSectionHeaderSubtitleViewStyle}>
                            <Text style={styles.reviewSectionHeaderSubtitleTextStyle}>
                                QUALITY OF WORK
                            </Text>
                            <RatingWithCount rating={ratings.quality_of_delivered_work} />
                        </View>
                        <View style={styles.reviewSectionHeaderSubtitleViewStyle}>
                            <Text style={styles.reviewSectionHeaderSubtitleTextStyle}>
                                RECOMMEND TO OTHERS
                            </Text>
                            <RatingWithCount rating={ratings.recommended_for_others} />
                        </View>
                    </View>
                </View>
                <View style={styles.doshline} />
                <View style={styles.reviewMessagesViewStyle}>
                    <View style={styles.reviewMessageViewStyle} >
                        <Image
                            style={styles.profileImageStyle}
                            source={{ uri : myReviews[0].profile}}
                        />
                        <View style={styles.profileDetailViewStyle}>
                            <View style={{ display: 'flex', flexDirection: 'row' }} >
                                <Text style={styles.profileDetailTextStyle}>
                                 {myReviews[0].name}
                                </Text>
                                <RatingWithCount rating={data.recommended_for_others} />
                            </View>
                            <Text style={styles.reviewMessageTextStyle} > {myReviews[0].messages}</Text>
                            <Text style={styles.reviewMessageTimeStyle} >Since 1 month</Text>
                        </View>
                    </View>
                    <View style={[styles.reviewMessageViewStyle, { paddingLeft: 50, paddingTop: 20 }]} >
                        <Image
                            style={styles.profileImageStyle}
                            source={{ uri : myReviews[1].profile}}
                        />
                        <View style={styles.profileDetailViewStyle}>
                            <View style={{ display: 'flex', flexDirection: 'row' }} >
                                <Text style={styles.profileDetailTextStyle}>
                                {myReviews[1].name}
                                </Text>
                            </View>
                            <Text style={styles.reviewMessageTextStyle} >  {myReviews[1].messages}</Text>
                            <Text style={styles.reviewMessageTimeStyle} >Since 1 month</Text>
                        </View>
                    </View>
                </View>
            </View>
            </>
            : null
        }
        </>
    );
};

export default ReviewCard;
