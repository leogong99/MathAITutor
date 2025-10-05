#!/bin/bash

# Build script for Cloud Build
echo "Installing dependencies..."
npm ci

echo "Building Next.js application..."
npm run build

echo "Build completed successfully!"
