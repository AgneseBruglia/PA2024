FROM python:latest

WORKDIR /app

COPY requirements.txt .
COPY . .

RUN pip install -r requirements.txt

EXPOSE ${PYTHON_PORT}

CMD ["python", "server_python.py"]
