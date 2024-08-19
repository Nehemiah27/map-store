build-app-map-store:
	docker build . -t map-store-rest-api-image -f Dockerfile.production

run-app-map-store:
	docker-compose -f docker-compose-map-store.yml up -d

stop-app-map-store:
	docker-compose -f docker-compose-map-store.yml down
