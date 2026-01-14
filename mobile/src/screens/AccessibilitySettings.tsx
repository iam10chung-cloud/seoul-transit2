import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAccessibility, createDefaultProfile } from '../contexts/AccessibilityContext';
import { AccessibilityType } from '../types/api';

export default function AccessibilitySettings() {
  const {
    profile,
    updateProfile,
    clearProfile,
    easyMode,
    setEasyMode,
    voiceGuidanceEnabled,
    setVoiceGuidanceEnabled,
    highContrastMode,
    setHighContrastMode,
  } = useAccessibility();

  const [selectedTypes, setSelectedTypes] = useState<AccessibilityType[]>(
    profile?.accessibilityTypes || []
  );

  const toggleAccessibilityType = (type: AccessibilityType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleSaveProfile = async () => {
    if (selectedTypes.length === 0) {
      Alert.alert(
        '알림',
        '최소 하나 이상의 접근성 유형을 선택해주세요.',
        [{ text: '확인' }]
      );
      return;
    }

    try {
      const newProfile = createDefaultProfile(selectedTypes);
      await updateProfile(newProfile);
      Alert.alert('저장 완료', '접근성 프로필이 저장되었습니다.', [{ text: '확인' }]);
    } catch (error) {
      Alert.alert('오류', '프로필 저장에 실패했습니다.', [{ text: '확인' }]);
    }
  };

  const handleClearProfile = () => {
    Alert.alert(
      '프로필 삭제',
      '접근성 프로필을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearProfile();
              setSelectedTypes([]);
              Alert.alert('삭제 완료', '프로필이 삭제되었습니다.');
            } catch (error) {
              Alert.alert('오류', '프로필 삭제에 실패했습니다.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>♿ 접근성 설정</Text>
        <Text style={styles.subtitle}>Accessibility Settings</Text>
      </View>

      {/* Accessibility Type Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>접근성 유형 선택</Text>
        <Text style={styles.sectionSubtitle}>필요한 접근성 지원을 모두 선택하세요</Text>

        <TouchableOpacity
          style={[
            styles.typeCard,
            selectedTypes.includes(AccessibilityType.WHEELCHAIR) && styles.typeCardSelected,
          ]}
          onPress={() => toggleAccessibilityType(AccessibilityType.WHEELCHAIR)}
        >
          <View style={styles.typeHeader}>
            <Text style={styles.typeIcon}>♿</Text>
            <Text style={styles.typeName}>휠체어 이용자</Text>
          </View>
          <Text style={styles.typeDescription}>
            엘리베이터, 경사로, 계단 없는 경로를 우선 제공합니다.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeCard,
            selectedTypes.includes(AccessibilityType.VISUAL_IMPAIRMENT) && styles.typeCardSelected,
          ]}
          onPress={() => toggleAccessibilityType(AccessibilityType.VISUAL_IMPAIRMENT)}
        >
          <View style={styles.typeHeader}>
            <Text style={styles.typeIcon}>👁️</Text>
            <Text style={styles.typeName}>시각 장애</Text>
          </View>
          <Text style={styles.typeDescription}>
            음성 안내, 점자 표지판, 촉각 포장이 있는 경로를 제공합니다.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeCard,
            selectedTypes.includes(AccessibilityType.HEARING_IMPAIRMENT) && styles.typeCardSelected,
          ]}
          onPress={() => toggleAccessibilityType(AccessibilityType.HEARING_IMPAIRMENT)}
        >
          <View style={styles.typeHeader}>
            <Text style={styles.typeIcon}>👂</Text>
            <Text style={styles.typeName}>청각 장애</Text>
          </View>
          <Text style={styles.typeDescription}>
            시각적 안내판과 유도 루프가 있는 경로를 제공합니다.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeCard,
            selectedTypes.includes(AccessibilityType.COGNITIVE) && styles.typeCardSelected,
          ]}
          onPress={() => toggleAccessibilityType(AccessibilityType.COGNITIVE)}
        >
          <View style={styles.typeHeader}>
            <Text style={styles.typeIcon}>🧠</Text>
            <Text style={styles.typeName}>인지 장애</Text>
          </View>
          <Text style={styles.typeDescription}>
            단순한 경로, 적은 환승, 단계별 안내를 제공합니다.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.typeCard,
            selectedTypes.includes(AccessibilityType.ELDERLY) && styles.typeCardSelected,
          ]}
          onPress={() => toggleAccessibilityType(AccessibilityType.ELDERLY)}
        >
          <View style={styles.typeHeader}>
            <Text style={styles.typeIcon}>👴</Text>
            <Text style={styles.typeName}>노약자</Text>
          </View>
          <Text style={styles.typeDescription}>
            짧은 도보 거리, 적은 환승, 여유 있는 환승 시간을 제공합니다.
          </Text>
        </TouchableOpacity>
      </View>

      {/* Additional Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>추가 설정</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>🎨 쉬운 모드</Text>
            <Text style={styles.settingDescription}>
              큰 버튼과 단순한 인터페이스
            </Text>
          </View>
          <Switch value={easyMode} onValueChange={setEasyMode} />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>🔊 음성 안내</Text>
            <Text style={styles.settingDescription}>
              경로를 음성으로 안내합니다
            </Text>
          </View>
          <Switch value={voiceGuidanceEnabled} onValueChange={setVoiceGuidanceEnabled} />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>🎨 고대비 모드</Text>
            <Text style={styles.settingDescription}>
              높은 대비의 색상 사용
            </Text>
          </View>
          <Switch value={highContrastMode} onValueChange={setHighContrastMode} />
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>✅ 저장</Text>
        </TouchableOpacity>

        {profile && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearProfile}>
            <Text style={styles.clearButtonText}>🗑️ 프로필 삭제</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Current Profile Info */}
      {profile && (
        <View style={styles.profileInfo}>
          <Text style={styles.profileTitle}>현재 프로필</Text>
          <Text style={styles.profileText}>
            • 계단 피하기: {profile.preferences.avoidStairs ? '예' : '아니오'}
          </Text>
          <Text style={styles.profileText}>
            • 최대 환승: {profile.preferences.maxTransfers}회
          </Text>
          <Text style={styles.profileText}>
            • 최대 도보 거리: {profile.preferences.maxWalkingDistance}m
          </Text>
          <Text style={styles.profileText}>
            • 추가 환승 시간: {profile.preferences.extraTransferTime}분
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 15,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  typeCard: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  typeCardSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIcon: {
    fontSize: 32,
    marginRight: 10,
  },
  typeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  typeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingInfo: {
    flex: 1,
  },
  settingName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    padding: 15,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#f44336',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileInfo: {
    backgroundColor: 'white',
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
});
