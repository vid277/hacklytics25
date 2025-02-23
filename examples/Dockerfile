
FROM python:3.9.7

WORKDIR /

RUN python -m venv venv


RUN . venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt


RUN mkdir -p /outputs

CMD ["/bin/bash", "-c", ". venv/bin/activate && python main.py"]