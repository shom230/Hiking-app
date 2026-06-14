import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  Platform, 
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, BORDER_RADIUS, SHADOWS, TYPOGRAPHY } from '../styles/theme';

export default function NicknameModal({ visible, onSave }) {
  const [nickname, setNickname] = useState('');
  const inputRef = useRef(null);

  const handleModalShow = () => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  useEffect(() => {
    if (visible) {
      handleModalShow();
    }
  }, [visible]);

  const handleSubmit = () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      alert('닉네임을 입력해 주세요.');
      return;
    }
    if (trimmed.length < 2) {
      alert('닉네임은 최소 2글자 이상이어야 합니다.');
      return;
    }
    if (trimmed.length > 15) {
      alert('닉네임은 최대 15글자까지 가능합니다.');
      return;
    }
    onSave(trimmed);
  };

  const handleInputPress = () => {
    inputRef.current?.focus();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      statusBarTranslucent={true}
      onRequestClose={() => {}} // Block dismissal on Android back button
    >
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardContainer}
          >
            <View style={[styles.modalContent, SHADOWS.medium]}>
              <View style={styles.iconContainer}>
                <Ionicons name="compass" size={48} color="#2E7D32" />
              </View>

              <Text style={styles.title}>등산도감 시작하기</Text>
              <Text style={styles.subtitle}>
                등산 기록을 관리하고 실시간 랭킹에 참여하기 위해 사용할 닉네임을 입력해 주세요.
              </Text>

              <View style={styles.inputContainer}>
                <TouchableOpacity
                  onPress={handleInputPress}
                  activeOpacity={1}
                  style={{ width: '100%' }}
                >
                  <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder="사용할 닉네임 입력 (2~15자)"
                    placeholderTextColor="#94A3B8"
                    value={nickname}
                    onChangeText={setNickname}
                    maxLength={15}
                    autoCapitalize="none"
                    autoFocus={false}
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                    onPressIn={() => inputRef.current?.focus()}
                    onClick={() => Platform.OS === 'web' && inputRef.current?.focus()}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>저장하고 시작하기</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 26, 20, 0.7)', // Premium semi-transparent dark green tint
    pointerEvents: 'auto',
  },
  keyboardContainer: {
    width: '100%',
    maxWidth: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#F5F5F5',
    width: '100%',
    zIndex: 9999,
    pointerEvents: 'auto',
    textAlign: 'center',
    fontWeight: '600',
    color: '#1E293B',
    height: 52,
  },
  submitButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2E7D32',
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
