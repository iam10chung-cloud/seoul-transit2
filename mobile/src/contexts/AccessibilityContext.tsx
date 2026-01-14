import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserAccessibilityProfile, AccessibilityType } from '../types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AccessibilityContextType {
  profile: UserAccessibilityProfile | null;
  updateProfile: (profile: UserAccessibilityProfile) => Promise<void>;
  clearProfile: () => Promise<void>;
  isAccessibilityEnabled: boolean;
  easyMode: boolean;
  setEasyMode: (enabled: boolean) => void;
  voiceGuidanceEnabled: boolean;
  setVoiceGuidanceEnabled: (enabled: boolean) => void;
  highContrastMode: boolean;
  setHighContrastMode: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = '@seoul_transit_accessibility_profile';
const EASY_MODE_KEY = '@seoul_transit_easy_mode';
const VOICE_GUIDANCE_KEY = '@seoul_transit_voice_guidance';
const HIGH_CONTRAST_KEY = '@seoul_transit_high_contrast';

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserAccessibilityProfile | null>(null);
  const [easyMode, setEasyModeState] = useState(false);
  const [voiceGuidanceEnabled, setVoiceGuidanceState] = useState(false);
  const [highContrastMode, setHighContrastState] = useState(false);

  // Load profile from storage on mount
  useEffect(() => {
    loadProfile();
    loadSettings();
  }, []);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load accessibility profile:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const [easyModeValue, voiceValue, contrastValue] = await Promise.all([
        AsyncStorage.getItem(EASY_MODE_KEY),
        AsyncStorage.getItem(VOICE_GUIDANCE_KEY),
        AsyncStorage.getItem(HIGH_CONTRAST_KEY),
      ]);

      if (easyModeValue) setEasyModeState(easyModeValue === 'true');
      if (voiceValue) setVoiceGuidanceState(voiceValue === 'true');
      if (contrastValue) setHighContrastState(contrastValue === 'true');
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const updateProfile = async (newProfile: UserAccessibilityProfile) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.error('Failed to save accessibility profile:', error);
      throw error;
    }
  };

  const clearProfile = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setProfile(null);
    } catch (error) {
      console.error('Failed to clear accessibility profile:', error);
      throw error;
    }
  };

  const setEasyMode = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(EASY_MODE_KEY, enabled.toString());
      setEasyModeState(enabled);
    } catch (error) {
      console.error('Failed to save easy mode setting:', error);
    }
  };

  const setVoiceGuidanceEnabled = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(VOICE_GUIDANCE_KEY, enabled.toString());
      setVoiceGuidanceState(enabled);
    } catch (error) {
      console.error('Failed to save voice guidance setting:', error);
    }
  };

  const setHighContrastMode = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(HIGH_CONTRAST_KEY, enabled.toString());
      setHighContrastState(enabled);
    } catch (error) {
      console.error('Failed to save high contrast setting:', error);
    }
  };

  const isAccessibilityEnabled = profile !== null && profile.accessibilityTypes.length > 0;

  return (
    <AccessibilityContext.Provider
      value={{
        profile,
        updateProfile,
        clearProfile,
        isAccessibilityEnabled,
        easyMode,
        setEasyMode,
        voiceGuidanceEnabled,
        setVoiceGuidanceEnabled,
        highContrastMode,
        setHighContrastMode,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

// Helper function to create default profile
export const createDefaultProfile = (
  types: AccessibilityType[]
): UserAccessibilityProfile => {
  const hasWheelchair = types.includes(AccessibilityType.WHEELCHAIR);
  const hasVisual = types.includes(AccessibilityType.VISUAL_IMPAIRMENT);
  const hasCognitive = types.includes(AccessibilityType.COGNITIVE);

  return {
    accessibilityTypes: types,
    preferences: {
      avoidStairs: hasWheelchair,
      requireElevator: hasWheelchair,
      requireLowFloorBus: hasWheelchair,
      requireAudioGuidance: hasVisual,
      requireVisualGuidance: false,
      requireSimpleRoutes: hasCognitive,
      extraTransferTime: hasCognitive ? 5 : 2,
      maxWalkingDistance: hasWheelchair ? 500 : 1000,
      maxTransfers: hasCognitive ? 1 : 3,
    },
    assistanceNeeds: {
      companionAlert: false,
      practiceMode: hasCognitive,
    },
  };
};
