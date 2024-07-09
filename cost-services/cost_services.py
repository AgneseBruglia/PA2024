import cv2
from flask import Flask, abort, request, jsonify
import os 


app = Flask(__name__)
COST = 1.25


def count_total_frames(video_paths):
    total_frames = 0
    
    for video_path in video_paths:
        cap = cv2.VideoCapture(video_path)
        
        # Verifica se il video è stato aperto correttamente
        #if not cap.isOpened():
           # print(f"Errore nell'aprire il video: {video_path}")
           # continue
        
        # Ottieni il numero di frame del video
        frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        total_frames += frames
        
        # Rilascia il video
        cap.release()
    
    return total_frames


@app.route('/cost', methods=['POST'])
def get_total_frames():
    if not request.is_json:
        return jsonify({"error": "Invalid input"}), 400
    
    data = request.get_json()
    if 'video_paths' not in data:
        return jsonify({"error": "Missing 'video_paths' key"}), 400
    
    video_paths = data['video_paths']
    if not isinstance(video_paths, list):
        return jsonify({"error": "'video_paths' must be a list"}), 400
    
    total_frames = count_total_frames(video_paths)
    return jsonify({"total_frames": total_frames*COST}), 200



if __name__ == '__main__':
    port = int(os.environ.get('COST_SERVICES_PORT'))
    app.run(host=os.environ.get('COST_SERVICES_HOST'), port=port, debug=True)