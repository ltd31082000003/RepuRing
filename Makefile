# Variables
GO_BIN_DIR := ~/go/bin
CLI_DIR := ./cmd/main/...
AUTO_UPDATE_DIR := ./cmd/auto-update/...
WALLET_DIR := ./cmd/rpc/web/wallet
EXPLORER_DIR := ./cmd/rpc/web/explorer

# ==================================================================================== #
# HELPERS
# ==================================================================================== #

## help: print each command's help message
.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'

# Targets, this is a list of all available commands which can be executed using the make command.
.PHONY: build/canopy build/canopy-full build/wallet build/explorer build/auto-update build/auto-update-local run/auto-update run/auto-update-build run/auto-update-test test/all dev/deps \
	build/plugin build/kotlin-plugin build/go-plugin build/typescript-plugin build/python-plugin build/csharp-plugin build/all-plugins

# ==================================================================================== #
# BUILDING
# ==================================================================================== #

## build/canopy: build the canopy binary into the GO_BIN_DIR with embedded wallet and explorer assets
build/canopy: build/wallet build/explorer
	go build -o $(GO_BIN_DIR)/canopy $(CLI_DIR)

## build/canopy-full: build the canopy binary and its wallet and explorer altogether
build/canopy-full: build/canopy

## build/wallet: build the canopy's wallet project
build/wallet:
	npm install --prefix $(WALLET_DIR) && npm run build --prefix $(WALLET_DIR)

## build/explorer: build the canopy's explorer project
build/explorer:
	npm install --prefix $(EXPLORER_DIR) && npm run build --prefix $(EXPLORER_DIR)

## build/auto-update: build the canopy auto-update binary into the GO_BIN_DIR
build/auto-update:
	go build -o $(GO_BIN_DIR)/canopy-auto-update $(AUTO_UPDATE_DIR)

## build/auto-update-local: build canopy CLI to ./cli and auto-update binary for local development
build/auto-update-local:
	go build -o ./cli $(CLI_DIR)
	go build -o $(GO_BIN_DIR)/canopy-auto-update $(AUTO_UPDATE_DIR)

## run/auto-update: run the canopy auto-update binary with 'start' command (requires ./cli to exist)
run/auto-update:
	BIN_PATH=./cli go run $(AUTO_UPDATE_DIR) start

## run/auto-update-build: build canopy CLI to ./cli and then run auto-update
run/auto-update-build: build/auto-update-local
	BIN_PATH=./cli go run $(AUTO_UPDATE_DIR) start

# ==================================================================================== #
# TESTING
# ==================================================================================== #

## test/all: run all canopy tests
test/all:
	go test ./... -p=1

## test/fuzz: run all canopy fuzz tests individually
test/fuzz:
	# Golang currently does not support multiple fuzz targets, so each need to be called individually
	# For more information check the open issue: https://github.com/golang/go/issues/46312
	go test -fuzz=FuzzKeyDecodeEncode ./store -fuzztime=5s
	go test -fuzz=FuzzBytesToBits ./store -fuzztime=5s

# ==================================================================================== #
# DEVELOPMENT
# ==================================================================================== #

## dev/deps: install all dependencies on the project's directory
dev/deps:
	go mod vendor

# ==================================================================================== #
# PLUGINS
# ==================================================================================== #

# Plugin selection: make build/plugin PLUGIN=kotlin
PLUGIN ?= kotlin

## build/plugin: build a specific plugin (PLUGIN=kotlin|go|typescript|python|csharp|all)
build/plugin:
ifeq ($(PLUGIN),kotlin)
	cd plugin/kotlin && ./gradlew fatJar --no-daemon
else ifeq ($(PLUGIN),go)
	cd plugin/go && go build -o go-plugin .
else ifeq ($(PLUGIN),typescript)
	cd plugin/typescript && npm ci && npm run build:all
else ifeq ($(PLUGIN),python)
	cd plugin/python && make dev
else ifeq ($(PLUGIN),csharp)
	cd plugin/csharp && rm -rf bin && dotnet publish -c Release -r linux-x64 --self-contained true -o bin
else ifeq ($(PLUGIN),all)
	$(MAKE) build/plugin PLUGIN=go
	$(MAKE) build/plugin PLUGIN=kotlin
	$(MAKE) build/plugin PLUGIN=typescript
	$(MAKE) build/plugin PLUGIN=python
	$(MAKE) build/plugin PLUGIN=csharp
else
	@echo "Unknown plugin: $(PLUGIN). Options: kotlin, go, typescript, python, csharp, all"
	@exit 1
endif

## build/kotlin-plugin: build the Kotlin plugin
build/kotlin-plugin:
	$(MAKE) build/plugin PLUGIN=kotlin

## build/go-plugin: build the Go plugin
build/go-plugin:
	$(MAKE) build/plugin PLUGIN=go

## build/typescript-plugin: build the TypeScript plugin
build/typescript-plugin:
	$(MAKE) build/plugin PLUGIN=typescript

## build/python-plugin: build the Python plugin
build/python-plugin:
	$(MAKE) build/plugin PLUGIN=python

## build/csharp-plugin: build the C# plugin
build/csharp-plugin:
	$(MAKE) build/plugin PLUGIN=csharp

## build/all-plugins: build all plugins
build/all-plugins:
	$(MAKE) build/plugin PLUGIN=all
