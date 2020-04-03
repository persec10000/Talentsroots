import React, { Component , useState , useEffect , createRef} from 'react';
import { View, Text, Image, Dimensions, TouchableHighlight,  ScrollView ,  FlatList, TouchableOpacity } from 'react-native';
import HTML from 'react-native-render-html';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const SCREEN_WIDTH = Dimensions.get('window').width;
import Modal from "react-native-modal";
import { Button } from 'native-base';
import { Rating, CheckBox, Badge } from 'react-native-elements';
import styles from './index.style';
import ProgressCircle from 'react-native-progress-circle'
import RootCardItem from '../rootCardItem';
import Icon from "react-native-vector-icons/FontAwesome";
import { widthPercentageToDP } from '../../../../commons/responsive_design';

const RootsCard = props => {
    const { data , myRoots } = props;


    //scroll
    const refScroll = createRef();
    const [scrollCount, setScrollCount] = useState(0);
    useEffect(() => {
        if (scrollCount !== myRoots.length) {
            refScroll.current.scrollTo({ x: widthPercentageToDP(88) * scrollCount })
        }else {
        setScrollCount(0)
        refScroll.current.scrollTo({ x: widthPercentageToDP(0) })
        }
    }, [scrollCount])


    return (
        <>
        {/*Other Roots Section*/}
        {
            myRoots.length > 0 ? 
            <>
            <View>
                <View style={styles.otherRootsTitleStyle}>
                    <Text style={styles.description}>
                        Roots
                    </Text>
                </View>
                {/*Other roots Section*/}
                {
                  myRoots && myRoots.length > 0 ?
                        <View style={{ paddingVertical: 10 }}>
                            <ScrollView
                             horizontal={true}
                             ref={refScroll}
                            >
                            {
                                myRoots.map((item,index) => {
                                    return <RootCardItem key={index} item={item} navigation={props.navigation} />
                                })
                            }
                            </ScrollView>
                            {/* <FlatList
                                ref={refScroll}
                                horizontal
                                data={myRoots}
                                renderItem={({ item }) =>  <RootCardItem item={item} navigation={props.navigation} />}
                                keyExtractor={item => item.id}
                            /> */}
                            {
                                myRoots.length > 1 ? 
                                <Icon 
                                style={styles.rightArrow}
                                name="chevron-circle-right" 
                                size={35} 
                                onPress={() => setScrollCount(scrollCount + 1)}
                                color="#DCDCDC" 
                                />
                                : null
                            }
                        </View>
                        : null
                }
            </View>
            </>
            : null
        }
        </>
    );
};

export default RootsCard;
