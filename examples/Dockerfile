
FROM python:3.9.7

RUN python -m venv venv


RUN . venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt

CMD ["/bin/bash", "-c", ". venv/bin/activate && python main.py"]