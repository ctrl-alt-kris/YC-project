FROM python:3.7
WORKDIR /code
RUN pip install pipenv
COPY Pipfile /code/Pipfile
COPY Pipfile.lock /code/Pipfile.lock
RUN pipenv install --system --deploy
RUN mkdir db
COPY . /code/app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

