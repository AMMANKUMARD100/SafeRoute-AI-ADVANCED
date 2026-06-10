"""
Audio feature extraction for voice stress detection.
Extracts acoustic features from audio files.
"""

import numpy as np
import librosa
import os

def extract_audio_features(audio_path):
    """
    Extract acoustic features from audio file.
    
    Returns:
        dict: Dictionary with extracted features
    """
    try:
        # Load audio
        y, sr = librosa.load(audio_path)
        
        # Extract features
        features = {}
        
        # 1. Pitch features
        f0 = librosa.yin(y, fmin=50, fmax=500)
        features['pitch_variation'] = np.std(f0[f0 > 0]) / (np.mean(f0[f0 > 0]) + 1e-6)
        features['mean_pitch'] = float(np.mean(f0[f0 > 0]))
        
        # 2. Spectral features
        S = librosa.feature.melspectrogram(y=y, sr=sr)
        
        # Spectral centroid (brightness)
        spectral_centroids = librosa.feature.spectral_centroid(S=S)[0]
        features['spectral_centroid'] = float(np.mean(spectral_centroids))
        
        # Spectral rolloff
        spectral_rolloff = librosa.feature.spectral_rolloff(S=S)[0]
        features['spectral_rolloff'] = float(np.mean(spectral_rolloff))
        
        # 3. Energy features
        energy = librosa.feature.melspectrogram(y=y, sr=sr)
        power = np.sqrt(np.mean(np.power(energy, 2)))
        features['mean_energy'] = float(power)
        
        # 4. Zero crossing rate (indicates high-frequency noise)
        zcr = librosa.feature.zero_crossing_rate(y)[0]
        features['zero_crossing_rate'] = float(np.mean(zcr))
        
        # 5. MFCC features (Mel-Frequency Cepstral Coefficients)
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        features['mfcc_mean'] = float(np.mean(np.mean(mfccs, axis=1)))
        features['mfcc_std'] = float(np.std(np.mean(mfccs, axis=1)))
        
        # 6. Speech rate estimation
        # Estimate based on onset strength
        onset_frames = librosa.onset.onset_detect(y=y, sr=sr)
        onset_rate = len(onset_frames) / (len(y) / sr)
        # Convert to approximate words per minute (assuming ~4 onsets per word)
        features['speech_rate'] = float(onset_rate * 15)  # 15 is a scaling factor
        
        # 7. Volume variation
        frame_energy = np.sqrt(np.sum(np.power(librosa.stft(y), 2), axis=0))
        features['volume_variation'] = float(np.std(frame_energy) / (np.mean(frame_energy) + 1e-6))
        
        # 8. Determine if stressed
        # Stress indicators: high pitch variance, high energy, high spectral centroid
        pitch_stress = features['pitch_variation'] > 1.2
        energy_stress = features['mean_energy'] > 0.03
        spectral_stress = features['spectral_centroid'] > 4000
        features['is_stressed'] = bool(pitch_stress or energy_stress or spectral_stress)
        
        # 9. Confidence score
        total_frames = len(y) / sr
        features['confidence'] = min(1.0, max(0, (total_frames - 0.5) / 5.0))
        
        return features
        
    except Exception as e:
        print(f"Error extracting features: {str(e)}")
        # Return default features on error
        return {
            'pitch_variation': 0.5,
            'mean_pitch': 150,
            'spectral_centroid': 3000,
            'spectral_rolloff': 8000,
            'mean_energy': 0.01,
            'zero_crossing_rate': 0.05,
            'mfcc_mean': 0,
            'mfcc_std': 0,
            'speech_rate': 120,
            'volume_variation': 0.5,
            'is_stressed': False,
            'confidence': 0.0
        }
