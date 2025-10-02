export type AudioTurn = {
    turnId: string;
    chunks: ArrayBuffer[];
    metadata?: {
        transcript: string;
        session_id: string;
        message: string;
        started_at: string;
        ended_at: string;
        current_state: string;
    };
    hasMetadata: boolean;
    isComplete: boolean;
};

export interface AudioQueueCallbacks {
    setIsAiSpeaking: (speaking: boolean) => void;
    showTranscript: (response: any) => void;
    setIsUserTurn: (isUserTurn: boolean) => void;
    getIsInterviewerTurnEndedReceived?: () => boolean;
}

export class AudioQueueManager {
    private audioTurnQueue: AudioTurn[] = [];
    private isPlaying: boolean = false;
    private currentTurnId: string | null = null;
    private currentAudio: HTMLAudioElement | null = null;

    constructor() {
        this.audioTurnQueue = [];
        this.isPlaying = false;
        this.currentTurnId = null;
        this.currentAudio = null;
    }

    private generateTurnId(): string {
        return `turn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    async collectAudioChunk(audioData: ArrayBuffer): Promise<void> {
        if (!this.currentTurnId) {
            this.currentTurnId = this.generateTurnId();
        }

        let currentTurn = this.audioTurnQueue.find(turn => turn.turnId === this.currentTurnId);
        if (!currentTurn) {
            currentTurn = {
                turnId: this.currentTurnId,
                chunks: [],
                hasMetadata: false,
                isComplete: false
            };
            this.audioTurnQueue.push(currentTurn);
        }

        currentTurn.chunks.push(audioData);
    }

    addMetadataToCurrentTurn(responseData: any): void {
        if (!this.currentTurnId) {
            return;
        }

        const currentTurn = this.audioTurnQueue.find(turn => turn.turnId === this.currentTurnId);
        if (!currentTurn) {
            return;
        }

        currentTurn.metadata = {
            transcript: responseData.transcript || responseData.message || '',
            session_id: responseData.session_id,
            message: responseData.message || '',
            started_at: responseData.started_at || '',
            ended_at: responseData.ended_at || '',
            current_state: responseData.current_state || ''
        };
        currentTurn.hasMetadata = true;
        currentTurn.isComplete = true;

        this.currentTurnId = null;
    }

    private async processAudioQueue(
        callbacks: AudioQueueCallbacks,
        isHeadphonesMuted: boolean,
        isConnected: boolean
    ): Promise<void> {
        if (!isConnected || this.isPlaying || this.audioTurnQueue.length === 0) {
            return;
        }

        const completeTurnIndex = this.audioTurnQueue.findIndex(
            turn => turn.isComplete && turn.hasMetadata && turn.chunks.length > 0
        );
            
        if (completeTurnIndex === -1) {
            return;
        }

        const currentTurn = this.audioTurnQueue.splice(completeTurnIndex, 1)[0];
        
        this.isPlaying = true;
        callbacks.setIsAiSpeaking(true);

        try {
            if (currentTurn.metadata?.transcript) {
                callbacks.showTranscript(currentTurn.metadata);
            }

            const totalLength = currentTurn.chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
            const mergedArray = new Uint8Array(totalLength);
            let offset = 0;

            for (const chunk of currentTurn.chunks) {
                mergedArray.set(new Uint8Array(chunk), offset);
                offset += chunk.byteLength;
            }

            const mergedBlob = new Blob([mergedArray], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(mergedBlob);
            const audio = new Audio(url);
            audio.volume = isHeadphonesMuted ? 0 : 1;
            
            this.currentAudio = audio;
            this.currentAudio.volume = isHeadphonesMuted ? 0 : 1;

            await new Promise<void>((resolve) => {
                audio.onended = () => {
                    this.currentAudio = null;
                    resolve();
                };

                audio.onerror = () => {
                    this.currentAudio = null;
                    resolve();
                };

                audio.play()
                    .catch((err) => {
                        console.error("🔴 Error starting MP3 for turn:", currentTurn.turnId, err);
                        this.currentAudio = null;
                        resolve();
                    });
            });

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("🔴 Error processing audio for turn:", currentTurn.turnId, error);
            this.currentAudio = null;
        } finally {
            this.isPlaying = false;
            this.currentAudio = null;
            callbacks.setIsAiSpeaking(false);
            
            console.log('callbacks.getIsInterviewerTurnEndedReceived?.()', callbacks.getIsInterviewerTurnEndedReceived?.());
            console.log('this.audioTurnQueue.length', this.audioTurnQueue.length);
            if (callbacks.getIsInterviewerTurnEndedReceived?.() && this.audioTurnQueue.length === 0) {
                callbacks.setIsUserTurn(true);
            }

            setTimeout(() => {
                this.processAudioQueue(callbacks, isHeadphonesMuted, isConnected);
            }, 100);
        }
    }

    tryProcessAudioQueue(
        callbacks: AudioQueueCallbacks,
        isHeadphonesMuted: boolean,
        isConnected: boolean
    ): void {
        if (!this.isPlaying) {
            this.processAudioQueue(callbacks, isHeadphonesMuted, isConnected);
        }
    }

    clearQueue(): void {
        this.audioTurnQueue.length = 0;
        this.currentTurnId = null;
        this.isPlaying = false;
        this.stopCurrentAudio();
    }

    stopCurrentAudio(): void {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
        }
    }

    setVolume(volume: number): void {
        if (this.currentAudio) {
            this.currentAudio.volume = Math.max(0, Math.min(1, volume));
        }
    }

    getQueueLength(): number {
        return this.audioTurnQueue.length;
    }

    getIsPlaying(): boolean {
        return this.isPlaying;
    }
}
