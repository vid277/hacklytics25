
FROM python:3.9.7

WORKDIR /

COPY environment.yaml ./
RUN conda env create -f environment.yaml

RUN mkdir -p /outputs

CMD ["/bin/bash", "-c", ". venv/bin/activate && python main.py"]