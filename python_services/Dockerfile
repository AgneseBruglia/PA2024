# Usa un'immagine di Python ufficiale come base
FROM python:latest

# Imposta la directory di lavoro nell'immagine
WORKDIR /app

# Copia il codice dell'applicazione nell'immagine
COPY requirements.txt .
COPY python_services.py .


# Installa le dipendenze dell'applicazione
RUN pip install -r requirements.txt


# Espone la porta su cui l'applicazione Flask è in ascolto
EXPOSE 5000

# Comando per eseguire l'applicazione quando il container viene avviato
CMD ["python", "python_services.py"]
