#!/bin/bash
gunicorn app:app --daemon
echo "Hello"
python worker.py
