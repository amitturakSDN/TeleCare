// import Modal from 'react-native-modal'
import {Icon, TextView} from '@/components';
import {moderateScale} from '@/hooks/scale';
import {useRef, useState} from 'react';
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
export const ChatList = props => {
  const chatInputRef = useRef(null);
  const {
    showChatBox,
    closeChat,
    // deleteChatMessage,
    chatMessages,
    sendChatMessage,
    onListTouchEnd,
    onListTouchStart,
    refreshFlatlist,
  } = props;
  const [chatMessage, setChatMessage] = useState(null);
  return (
    <Modal
      // animationIn
      transparent={true}
      visible={showChatBox}
      statusBarTranslucent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'grey',
          paddingHorizontal: moderateScale(20),
          paddingTop: moderateScale(20),
        }}>
        <TouchableOpacity
          onPress={closeChat}
          style={{paddingTop: moderateScale(10)}}>
          <TextView title={'Close'}></TextView>
        </TouchableOpacity>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
          style={{
            flex: 0.9,
          }}>
          <View style={{height: '99%'}}>
            <View style={styles.middleWrapper} pointerEvents="box-none">
              <FlatList
                contentContainerStyle={styles.chatList}
                onTouchStart={onListTouchStart}
                onTouchEnd={onListTouchEnd}
                data={chatMessages}
                extraData={refreshFlatlist}
                renderItem={({item}) => (
                  <View>
                    <View style={styles.chatMessage}>
                      <Text style={styles.chatUser}>
                        {item.senderUser.userName}:
                      </Text>
                      <Text style={styles.chatContent}> {item.content}</Text>
                    </View>
                    {/* <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => {
                                            Alert.alert('Delete Message', 'Delete this message?', [
                                                {
                                                    text: 'Cancel',
                                                    onPress: () => __DEV__ && console.log('Cancel Pressed'),
                                                    style: 'cancel',
                                                },
                                                {
                                                    text: 'OK',
                                                    onPress: () => {
                                                        deleteChatMessage(item.messageID, item);
                                                    },
                                                },
                                            ]);
                                        }}>
                                        <Text style={styles.deleteText}>Delete</Text>
                                    </TouchableOpacity> */}
                  </View>
                )}
                keyExtractor={(item, index) =>
                  `${String(item.timestamp)}${index}`
                }
                showsVerticalScrollIndicator={false}
                fadingEdgeLength={50}
                inverted
              />
            </View>
          </View>
          <View style={{flex: 0.1}}>
            <Animated.View>
              <View style={styles.chatInputWrapper}>
                <TextInput
                  style={styles.chatInput}
                  ref={chatInputRef}
                  placeholder="Type comment"
                  placeholderTextColor="#AAA"
                  onChangeText={text => {
                    // scaleChatSend(text.length !== 0);
                    setChatMessage(text);
                  }}
                  onSubmitEditing={() => {
                    sendChatMessage(chatMessage);
                    chatInputRef.current?.clear();
                    // setChatMessage(null)
                  }}
                />
                <Animated.View
                  style={[
                    // chatSendButtonScaleAnimatedStyle,
                    styles.chatSendButton,
                  ]}>
                  <Icon
                    name="chatSend"
                    onPress={() => {
                      sendChatMessage(chatMessage);
                      chatInputRef.current?.clear();
                      setChatMessage(null);
                    }}
                  />
                </Animated.View>
              </View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  middleWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  chatList: {
    paddingRight: 16,
  },

  chatMessage: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'rgba(255,255,255,0.5)',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  chatUser: {
    fontSize: 14,
    color: '#CCC',
  },
  chatContent: {
    fontSize: 14,
    color: '#FFF',
  },
  controls: {
    alignSelf: 'center',
    paddingTop: 24,
  },
  controlButton: {
    marginBottom: 12,
  },
  //   deleteButton: {
  //     fontSize: 10,
  //     paddingLeft: 4,
  //   },
  //   deleteText: {
  //     color: '#FFF',
  //   },
  chatInputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatInput: {
    flex: 1,
    height: 40,
    marginVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#666',
    color: '#AAA',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  chatSendButton: {
    height: 36,
  },
});
