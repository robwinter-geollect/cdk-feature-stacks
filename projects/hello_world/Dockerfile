FROM public.ecr.aws/docker/library/python:3.9-slim-buster

RUN useradd -ms /bin/bash geollect

USER geollect
WORKDIR /home/geollect

# Create venv and activate it permamently
ENV VIRTUAL_ENV=/home/geollect/venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

COPY --chown=geollect  ./projects/hello_world/ ./

CMD ["python", "main.py"]