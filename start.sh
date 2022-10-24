#!/bin/sh

set -x

if command -v npx &> /dev/null; then
    npx http-server@13.0.2 --port 8080
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8080
elif command -v python3; then
    python3 -m http.server 8080
else
    echo 'No compatible HTTP server found'
fi
