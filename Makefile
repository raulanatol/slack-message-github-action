.DEFAULT_GOAL := check

init:
	@echo "Initialising the project"
	@npm ci

build:
	@echo "👩‍🏭 Building..."
	@npm run build
	@npm run package

check: --pre_check
	@echo "✅"

clean_all:
	@echo "🧨 Clean all"
	@rm -Rf node_modules package-lock.json

release_patch: release

release_minor: check
	@.scripts/finish-release minor

release_major: check
	@.scripts/finish-release major

release: check
	@.scripts/finish-release patch

--pre_check:
	@npm ci
