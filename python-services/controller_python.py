import os
from flask import jsonify
import tensorflow as tf
import numpy as np
import cv2
from collections import defaultdict
from errors_factory import ErrorFactory, IncorrectFileError, ModelFileNotFoundError

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

# Funzione per l'inferenza sui video utilizzando il modello TensorFlow Lite selezionato
def _inferenceV3_ConvLSTM(videos, model_path):
    input_shape = (224, 224)
    batch_size = 16
    video_results = {}

    try:

        if not os.path.exists(model_path):
            raise ErrorFactory.create_error('ModelFileNotFoundError', model_path=model_path)

        model = _load_tflite_model(model_path)

        # Itera su tutti i file nella cartella video_folder
        for video in videos:
            
            # Verifica se il percorso è un file video
            if not os.path.exists(video): 
                raise ErrorFactory.create_error('FileNotFoundError')
            elif not any(video.endswith(extension) for extension in ['.mp4', '.avi', '.mov']):
                raise ErrorFactory.create_error('IncorrectFileError')
            else:
                results = []
                for chunks in _preprocess_video(video, input_shape, batch_size):
                    result = _run_inference(model, chunks)
                    results.append(result)
                
                # Calcola la media dei risultati dei batch per il video corrente
                average_result = np.mean(results)
                
                # Determina se è "Violento" o "Non Violento"
                label = "Violento" if average_result > 0.5 else "Non Violento"
                
                # Memorizza il risultato nel dizionario video_results
                video_results[video] = label

    except (ModelFileNotFoundError, FileNotFoundError, IncorrectFileError) as e:
        return {"error": str(e.message), "status_code": e.status}
    except Exception as e:
        raise e

    return video_results
