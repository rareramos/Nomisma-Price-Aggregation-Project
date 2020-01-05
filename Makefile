all: push

NPM_TOKEN = $(NPM_TOKEN)
PREFIX = 072858610312.dkr.ecr.us-east-1.amazonaws.com/price-aggregation
TAG = 0.0.4

build:
	docker build -t $(PREFIX):$(TAG) --build-arg NPM_TOKEN=$(NPM_TOKEN) .

push:
	docker push $(PREFIX):$(TAG)

clean:
	docker rmi $(PREFIX):$(TAG)
