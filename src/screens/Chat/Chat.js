import {IMAGES} from '@/assets';
import {AppHeader, Image, ListView2, SearchBar} from '@/components';
import {strings} from '@/localization';
import {styles} from '@/screens/Chat/Chat.styles';
import {getUser} from '@/selectors/UserSelectors';
import {useTheme} from '@react-navigation/native';
import {useState} from 'react';
import {TouchableOpacity, View, FlatList} from 'react-native';
import {useSelector} from 'react-redux';

export function Chat({navigation}) {
    const user = useSelector(getUser);
    const {colors} = useTheme();
    const [searchText, setSearchText] = useState('');
    const menu = [
        {
            title: 'Sebastian Rudiger',
            text: 'Perfect will check it when i will reach home',
            time: '09:30 PM',
            unreadMsgCount: 0,
            tick: IMAGES.icons.chat.readMsg,
            icon: IMAGES.icons.session.defaultUserImage,
            onPress: () => alert('take a reading'),
        },
        {
            title: 'Caroline Varsaha',
            text: 'Sounds good!',
            time: '10:30 AM',
            unreadMsgCount: 2,
            tick: IMAGES.icons.chat.readMsg,
            icon: IMAGES.icons.session.defaultUserImage,

            onPress: () => alert('Results Dashboard'),
        },
        {
            title: 'Caroline Varsaha',
            text: 'Thanks! Talk later!',
            time: '1:30 PM',
            unreadMsgCount: 0,
            tick: IMAGES.icons.chat.readMsg,
            icon: IMAGES.icons.session.defaultUserImage,
            onPress: () => alert('Results Dashboard'),
        },
        {
            title: 'Mohammed Arnold',
            text: 'Okay, lets see!',
            time: '10:30 PM',
            unreadMsgCount: 4,
            tick: IMAGES.icons.chat.readMsg,
            icon: IMAGES.icons.session.defaultUserImage,
            onPress: () => alert('Results Dashboard'),
        },
        {
            title: 'Caroline Varsaha',
            text: 'Great',
            time: '8:30 AM',
            unreadMsgCount: 12,
            tick: IMAGES.icons.chat.readMsg,
            icon: IMAGES.icons.session.defaultUserImage,
            onPress: () => alert('Results Dashboard'),
        },
        {
            title: 'Caroline Varsaha',
            text: 'Great',
            time: '8:30 AM',
            unreadMsgCount: 0,
            tick: IMAGES.icons.chat.readMsg,
            icon: IMAGES.icons.session.defaultUserImage,
            onPress: () => alert('Results Dashboard'),
        },
    ];

    return (
        <View style={styles.container}>
            <AppHeader
                title={strings.chat.chat}
                toggle={true}
                onBackPress={() => navigation.toggleDrawer()}
                onRightPress={() => alert('notification')}
            />
            <View style={styles.searchView}>
                <SearchBar
                    containerStyle={{flex: 0.92}}
                    editable={true}
                    value={searchText}
                    setCode={text => setSearchText(text)}
                    // handlePress={console.log('adas')}
                />

                <TouchableOpacity style={styles.searchEdit}>
                    <Image source={IMAGES.icons.chat.searchEdit} />
                </TouchableOpacity>
            </View>
            <FlatList
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                data={menu}
                extraData={menu}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => {
                    return (
                        <ListView2
                            name={item?.title}
                            userImage={
                                item?.image != null || item.image !== undefined
                                    ? {uri: item?.image}
                                    : IMAGES.icons.session.defaultUserImage
                            }
                            chatText={item?.text}
                            timeText={item?.time}
                            tickIcon={item?.tick}
                            unreadMsgCount={item.unreadMsgCount}
                        />
                    );
                }}
            />
        </View>
    );
}
