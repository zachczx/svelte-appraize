#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

echo "Running application generate command..."
pnpm generate

echo "Running database migrations..."
pnpm migrate

echo "Pushing database schema..."
pnpm push

echo "Starting application..."
# This command executes the command passed to the script.
# In our case, it will be the CMD from the Dockerfile ("node build/index.js")
exec "$@"