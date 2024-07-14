from flask import Flask, request, jsonify
import os
from errors_factory import ErrorFactory, ModelMissingError
from controller_python import  _inferenceV3_ConvLSTM

app = Flask(__name__)

# Definizione della rotta per fare inferenza su un certo insieme di video
@app.route('/inference', methods=['POST'])
def analyze_video():
    try:
        if 'model_name' not in request.json or 'videos' not in request.json:
            raise ErrorFactory.create_error('ModelMissingError')

        model = request.json['model_name']
        videos = request.json['videos']
        base_path = '/app/dataset_&_modelli/modelli/'
        model_path = os.path.join(base_path, model)

        predictions = _inferenceV3_ConvLSTM(videos, model_path)

        if 'error' in predictions:
            return jsonify({"error": predictions['error']}), predictions['status_code']
        else:
            return jsonify(predictions), 200

    except ModelMissingError as mpme:
        return jsonify({"error": str(mpme)}), 400

if __name__ == '__main__':
    port = int(os.environ.get('PYTHON_PORT'))
    server_python_host = os.environ.get('PYTHON_HOST')
    app.run(host=server_python_host, port=port, debug=False)
