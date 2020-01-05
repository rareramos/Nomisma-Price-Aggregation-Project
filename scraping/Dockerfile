FROM jlesage/firefox:v1.6.0

# installs python 3
RUN apk update
RUN apk add python3 tar wget
RUN pip3 install --upgrade pip

# installs gecko driver for selenium + firefox
RUN wget https://github.com/mozilla/geckodriver/releases/download/v0.24.0/geckodriver-v0.24.0-linux64.tar.gz
RUN tar -xvzf geckodriver*
RUN chmod +x geckodriver && mv geckodriver /usr/local/bin
ENV PATH $PATH:/usr/local/bin/geckodriver

WORKDIR /work-dir/scraping

COPY ./requirements.txt /work-dir/scraping/./requirements.txt
COPY ./__init__.py /work-dir/scraping/./__init__.py
COPY configs /work-dir/scraping/configs
COPY crawlers /work-dir/scraping/crawlers
COPY utils /work-dir/scraping/utils
COPY test /work-dir/scraping/test
COPY symbol_maps /work-dir/scraping/symbol_maps
COPY manage.py /work-dir/scraping/manage.py

RUN pip3 install -r requirements.txt

ENV PYTHONPATH /work-dir/
ENV MOZ_HEADLESS_HEIGHT 1080
ENV MOZ_HEADLESS_WIDTH 1920
