run: background-script
	ng build --watch 
	# cd dist/csper-builder
	# web-ext run --verbose

install:
	rm -rf node_modules
	npm install
	npm install -g typescript
	npm install -g @angular/cli
	npm install -g web-ext

versions:
	# macos 10.15.2 (19C57)
	node --version
	npm --version
	tsc --version
	ng v | grep 'Angular CLI

run-local:
	npm start

release: background-script
	ng build --aot --prod  --output-hashing=none
	web-ext build --source-dir=./dist/csper-builder --overwrite-dest --artifacts-dir=./dist

	# For firefox, compress all the invidivual files
	# FOr chrome, compress the folder
	# firefox about:debugging

background-script:
	tsc --project background/tsconfig.json
	cp background/dist/background/background.js src/assets/

copy-asset:
	cp ../csper-ui/src/assets/csper.webp src/assets/

copy-models:
	cp -r ../csper-ui/src/app/models src/app/models

copy-components:
	cp -r ../csper-ui/src/app/components/policy-view src/app/components
	cp -r ../csper-ui/src/app/components/report-chart src/app/components
	cp -r ../csper-ui/src/app/components/stat src/app/components

copy-service:
	cp ../csper-ui/src/app/services/policy.service.ts src/app/services
	cp ../csper-ui/src/app/services/report.service.ts src/app/services
	cp ../csper-ui/src/app/services/recommendation.service.ts src/app/services