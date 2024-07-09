from flask import Flask, abort, request, jsonify
import os
import tensorflow as tf
import numpy as np
import cv2
import json
from collections import defaultdict
from errors_factory import ErrorFactory, ModelMissingError, ModelFileNotFoundError, CustomError, IncorrectFileError, FileNotFoundError
from controller_python import _load_tflite_model, _inferenceV3_ConvLSTM

app = Flask(__name__)

@app.route('inference', methods=['POST'])
def analize_video():
    try:
        # Verifica se è stato specificato il modello con cui fare inferenza
        if 'model_name' not in request.json:
            raise ErrorFactory.create_error('ModelMissingError')
        
        model = request.args.get('model_name')
        videos = request.args.get('videos')
        model_path = '/app/dataset_&_modelli/modelli/' + model
    
        predictions = _inferenceV3_ConvLSTM(videos, model_path)

        return jsonify(predictions)

    except ModelMissingError as mpme:
        return jsonify({str(mpme)}), 400
    except ModelFileNotFoundError as mfne:
        return jsonify({str(mfne)}), 404
    except FileNotFoundError as mfne:
        return jsonify({str(mfne)}), 404
    except IncorrectFileError as mfne:
        return jsonify({str(mfne)}), 404
    except CustomError as ce:
        return jsonify({str(ce)}), 500
    except Exception as e:
        unexpected_error = ErrorFactory.create_error('UnexpectedError', message=str(e))
        return jsonify({"Errore": str(unexpected_error)}), 500



if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='py-services', port=port, debug=True)
