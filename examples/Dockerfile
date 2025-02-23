
FROM continuumio/miniconda3:latest


COPY environment.yaml ./


RUN conda env create -f environment.yaml


RUN echo "source activate $(head -1 environment.yaml | cut -d' ' -f2)" > ~/.bashrc
ENV PATH /opt/conda/envs/$(head -1 environment.yaml | cut -d' ' -f2)/bin:$PATH


RUN mkdir -p /outputs


COPY . .


CMD ["python", "main.py"]