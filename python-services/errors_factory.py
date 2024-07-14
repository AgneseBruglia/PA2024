""" Classi di errori possibili """

class CustomError(Exception):
    """ Classe di base per la generazione di errori """
    pass

class ModelMissingError(CustomError):
    """ Eccezione per mancanza del modello nella richiesta """
    def __init__(self, message="ERROR: Missing model path in the request.", status=404):
        self.message = message
        self.status = status
        super().__init__(self.message)

class ModelFileNotFoundError(CustomError):
    """ Eccezione: path del modello non trovato """
    def __init__(self, model_path, message="ERROR: Model file not found.", status=404):
        self.model_path = model_path
        self.message = f"{message} Path: {model_path}"
        self.status = status
        super().__init__(self.message)

class UnexpectedError(CustomError):
    """ Eccezione per errori inaspettati """
    def __init__(self, message="ERROR: An unexpected error occurred.", status = 404):
        self.message = message
        self.status = status 
        super().__init__(self.message)

class IncorrectFileError(CustomError):
    """ Eccezione per file che non sono video """
    def __init__(self, message="ERROR: File is not a video.", status = 404):
        self.message = message
        self.status = status 
        super().__init__(self.message)

class FileNotFoundError(CustomError):
    """ Eccezione per path video inesistente """
    def __init__(self, message="ERROR: File not found.", status = 404):
        self.message = message
        self.status = status
        super().__init__(self.message)

class ErrorFactory:
    @staticmethod
    def create_error(error_type, *args, **kwargs):
        if error_type == 'ModelMissingError':
            return ModelMissingError(*args, **kwargs)
        elif error_type == 'ModelFileNotFoundError':
            return ModelFileNotFoundError(*args, **kwargs)
        elif error_type == 'UnexpectedError':
            return UnexpectedError(*args, **kwargs)
        elif error_type == 'IncorrectFileError':
            return IncorrectFileError(*args, **kwargs)
        elif error_type == 'FileNotFoundError':
            return IncorrectFileError(*args, **kwargs)
        else:
            return CustomError("Unknown error type.")
