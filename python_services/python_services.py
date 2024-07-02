from flask import Flask, abort, request, jsonify
import os
import tensorflow as tf
import numpy as np
import cv2
import json
from collections import defaultdict

app = Flask(__name__)

# Variabile globale per il modello TensorFlow Lite
global_model = None

# Funzione per caricare il modello TensorFlow Lite
def _load_tflite_model(model_path):
    interpreter = tf.lite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()
    return interpreter

# Funzione per il preprocessamento del video
def _preprocess_video(video_path, input_shape, batch_size):
    cap = cv2.VideoCapture(video_path)
    frames = []
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.resize(frame, (input_shape[1], input_shape[0]))
        frame = frame.astype('float32')
        frames.append(frame)

    cap.release()
    frames = np.array(frames)

    if len(frames) >= batch_size:
        num_batches = len(frames) // batch_size
        frames = frames[:num_batches * batch_size]
        batches = np.split(frames, num_batches)
        batches = [np.reshape(batch, (1, batch_size, input_shape[0], input_shape[1], 3)) for batch in batches]
    else:
        batches = []

    return batches

# Funzione per eseguire l'inferenza sul video utilizzando il modello TensorFlow Lite
def _run_inference(interpreter, input_data):
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()

    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()
    output_data = interpreter.get_tensor(output_details[0]['index'])

    return float(output_data)

# Funzione per l'inferenza sul video utilizzando il modello TensorFlow Lite
def _inferenceV3_ConvLSTM(video_folder):
    global global_model

    if global_model is None:
        raise ValueError("Modello non caricato. Carica il modello utilizzando /loadModel endpoint.")

    
    input_shape = (224, 224)
    batch_size = 16

    video_results = {}

    # Itera su tutti i file nella cartella video_folder
    for filename in os.listdir(video_folder):
        video_path = os.path.join(video_folder, filename)
        
        # Verifica se il percorso è un file video
        if os.path.isfile(video_path) and any(video_path.endswith(extension) for extension in ['.mp4', '.avi', '.mov']):
            results = []
            for chunks in _preprocess_video(video_path, input_shape, batch_size):
                result = _run_inference(global_model, chunks)
                results.append(result)
            
            # Calcola la media dei risultati dei batch per il video corrente
            average_result = np.mean(results)
            
            # Determina se è "Violento" o "Non Violento"
            label = "Violento" if average_result > 0.5 else "Non Violento"
            
            # Memorizza il risultato nel dizionario video_results
            video_results[filename] = label

    return video_results

# Funzione per verificare i crediti residui
def _check_residual_credits(video_path):
    total_frames = 0

    # Itera su tutti i file nella cartella video_folder
    for filename in os.listdir(video_path):
        video_path = os.path.join(video_path, filename)
        
        # Verifica se il percorso è un file video
        if os.path.isfile(video_path) and any(video_path.endswith(extension) for extension in ['.mp4', '.avi', '.mov']):
            cap = cv2.VideoCapture(video_path)
            
            # Conta il numero di frame nel video corrente
            num_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            total_frames += num_frames
            
            # Chiudi il video capture
            cap.release()

    return float(total_frames) * 1.25

# Funzione per la gestione degli errori
@app.errorhandler(Exception)
def handle_exception(e):
    if isinstance(e, ValueError):
        return jsonify({"error": str(e)}), 400
    if isinstance(e, FileNotFoundError):
        return jsonify({"error": str(FileNotFoundError)}), 404
    if isinstance(e, PermissionError):
        return jsonify({"error": str(PermissionError)}), 401
    return jsonify({"error": "Internal server error"}), 500

# Rotte dell'applicazione Flask

@app.route('/analyzeVideo', methods=['GET'])
def analyze_video():
    video_path = request.args.get('video_path')
    residual_credits = request.args.get('residual_credits')
    # Verifica se il video esiste
    if not os.path.exists(video_path):
        raise FileNotFoundError('File not found error.')

    if _check_residual_credits(video_path) > float(residual_credits):
        raise PermissionError('Unauthorized access. Check residual tokens.')
    
    predictions = _inferenceV3_ConvLSTM(video_path)
    
    result_list = [{"video_name": video_name, "result": label} for video_name, label in predictions.items()]

    return jsonify(result_list)

@app.route('/info', methods=['GET'])
def app_info():
    app_name = "Applicazione di analisi video"
    app_version = "1.0.0"

    info = {
        "name": app_name,
        "version": app_version,
        "description": "Applicazione Flask per l'analisi di video tramite TensorFlow Lite."
    }

    return jsonify(info)

@app.route('/loadModel', methods=['POST'])
def load_model():
    global global_model
    
    if 'model_path' not in request.json:
        raise ValueError("Missing model path.")
    
    model_path = request.json['model_path']
    
    if not os.path.exists(model_path):
        raise FileNotFoundError
    
    global_model = _load_tflite_model(model_path)
    
    return jsonify({"Risultato": "Modello caricato con successo"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='py-services', port=port, debug=True)
