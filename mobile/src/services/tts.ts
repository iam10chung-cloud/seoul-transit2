import * as Speech from 'expo-speech';
import { VoiceGuidanceInstruction } from '../types/api';

export interface TTSOptions {
  language?: string;
  pitch?: number;
  rate?: number;
  volume?: number;
}

class TextToSpeechService {
  private isPlaying: boolean = false;
  private queue: VoiceGuidanceInstruction[] = [];
  private currentIndex: number = 0;

  /**
   * Speak a single text string
   */
  async speak(text: string, options: TTSOptions = {}): Promise<void> {
    const {
      language = 'ko-KR',
      pitch = 1.0,
      rate = 1.0,
      volume = 1.0,
    } = options;

    try {
      await Speech.speak(text, {
        language,
        pitch,
        rate,
        volume,
      });
    } catch (error) {
      console.error('TTS Error:', error);
      throw error;
    }
  }

  /**
   * Speak voice guidance instructions sequentially
   */
  async speakGuidance(
    instructions: VoiceGuidanceInstruction[],
    options: TTSOptions = {}
  ): Promise<void> {
    this.queue = instructions;
    this.currentIndex = 0;
    this.isPlaying = true;

    for (const instruction of instructions) {
      if (!this.isPlaying) break;

      try {
        await this.speak(instruction.instruction, options);

        // Add a small pause between instructions
        await new Promise((resolve) => setTimeout(resolve, 500));

        this.currentIndex++;
      } catch (error) {
        console.error('Error speaking guidance:', error);
        break;
      }
    }

    this.isPlaying = false;
  }

  /**
   * Speak a specific instruction by ID
   */
  async speakInstructionById(
    instructions: VoiceGuidanceInstruction[],
    instructionId: string,
    options: TTSOptions = {}
  ): Promise<void> {
    const instruction = instructions.find((i) => i.id === instructionId);
    
    if (instruction) {
      await this.speak(instruction.instruction, options);
    } else {
      console.warn(`Instruction not found: ${instructionId}`);
    }
  }

  /**
   * Stop current speech
   */
  stop(): void {
    Speech.stop();
    this.isPlaying = false;
  }

  /**
   * Pause current speech
   */
  pause(): void {
    Speech.pause();
    this.isPlaying = false;
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    Speech.resume();
    this.isPlaying = true;
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.isPlaying;
  }

  /**
   * Get available voices
   */
  async getAvailableVoices(): Promise<Speech.Voice[]> {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices;
    } catch (error) {
      console.error('Error getting voices:', error);
      return [];
    }
  }

  /**
   * Check if TTS is available
   */
  async isSpeechAvailable(): Promise<boolean> {
    try {
      const voices = await this.getAvailableVoices();
      return voices.length > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Generate summary announcement for route
   */
  generateRouteSummary(route: {
    totalDuration: number;
    transferCount: number;
    departureTime: string;
    arrivalTime: string;
  }): string {
    const minutes = Math.floor(route.totalDuration / 60);
    const departureTime = new Date(route.departureTime).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const arrivalTime = new Date(route.arrivalTime).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `이 경로는 총 ${minutes}분이 소요됩니다. 환승은 ${route.transferCount}회입니다. 출발 시간은 ${departureTime}, 도착 시간은 ${arrivalTime}입니다.`;
  }

  /**
   * Generate accessibility announcement
   */
  generateAccessibilityAnnouncement(score: {
    overall: number;
    details: {
      stepFree: boolean;
      elevatorsWorking: boolean;
      audioSupport: boolean;
      visualSupport: boolean;
    };
  }): string {
    const parts = [`이 경로의 접근성 점수는 ${score.overall}점입니다.`];

    if (score.details.stepFree) {
      parts.push('계단 없이 이용 가능합니다.');
    }

    if (score.details.elevatorsWorking) {
      parts.push('모든 엘리베이터가 정상 작동 중입니다.');
    }

    if (score.details.audioSupport) {
      parts.push('음성 안내가 지원됩니다.');
    }

    if (score.details.visualSupport) {
      parts.push('시각적 안내판이 있습니다.');
    }

    return parts.join(' ');
  }

  /**
   * Announce warnings
   */
  generateWarningsAnnouncement(warnings: string[]): string {
    if (warnings.length === 0) {
      return '경고 사항이 없습니다.';
    }

    const warningText = warnings
      .map((w) => w.replace(/[⚠️🔧♿🚶🚻]/g, '').trim())
      .join('. ');

    return `주의 사항: ${warningText}`;
  }
}

export const ttsService = new TextToSpeechService();
