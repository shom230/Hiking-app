import React, { useState } from 'react';
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

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}} // Block dismissal on Android back button
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                <TextInput
                  style={styles.input}
                  placeholder="사용할 닉네임 입력 (2~15자)"
                  placeholderTextColor="#94A3B8"
                  value={nickname}
                  onChangeText={setNickname}
                  maxLength={15}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
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
    flex: 1,
    backgroundColor: 'rgba(15, 26, 20, 0.7)', // Premium semi-transparent dark green tint
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    width: '100%',
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
    textAlign: 'center',
    fontWeight: '600',
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
