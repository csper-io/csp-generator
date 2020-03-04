run:
	npm start

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