FROM python:latest

WORKDIR /app

COPY requirements.txt .
COPY cost_services.py .

RUN pip install -r requirements.txt

EXPOSE ${COST_SERVICES_PORT}

CMD ["python", "cost_services.py"]
