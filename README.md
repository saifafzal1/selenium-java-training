# Selenium with Java — Training Platform

Interactive learning platform with 17 hands-on lessons and an AI assistant powered by Qwen.

## Quick Start

### 1. Prerequisites
- Node.js 18+ — https://nodejs.org
- Java 21 — https://adoptium.net
- Maven — https://maven.apache.org

### 2. Install & run
```bash
cd selenium-training
npm install
npm start
# Open http://localhost:3000
```

### 3. AI Chat (Qwen via Ollama)
```bash
# Install Ollama — https://ollama.com
ollama serve
ollama pull qwen2.5-coder:latest
```
The green dot in the chat header confirms Ollama is online.

## Curriculum (17 lessons, 6 modules)

| Module | Topics |
|--------|--------|
| ☕ Java Essentials | Setup, variables, control flow, OOP |
| 🔬 Selenium Basics | First test, locators, interactions, waits |
| ⚙️ Intermediate | Alerts, iFrames, JS Executor, Actions |
| 🏗️ Design Patterns | Page Object Model, Page Factory |
| 🧪 TestNG & Framework | Annotations, data-driven, config, reports |
| 🚀 Advanced | Screenshots, logging, Selenium Grid, parallel |

## Features
- **Progress tracking** — saved to disk across sessions
- **Per-lesson notes** — write and save your own notes
- **AI assistant** — context-aware Qwen chat for code help
- **Solution reveal** — show/hide exercise solutions

## Configuration
Override via environment variables:
```bash
PORT=8080 OLLAMA_URL=http://localhost:11434 QWEN_MODEL=qwen2.5-coder:7b npm start
```
