// rag/sources.js — documentation sources for the RAG ingestion pipeline
// These pages are fetched when online, chunked, embedded, and stored locally.
// After the first sync the AI tutor can answer from local knowledge even offline.
'use strict';

const SOURCES = [
  // ── Selenium WebDriver ────────────────────────────────────────
  {
    url:   'https://www.selenium.dev/documentation/webdriver/',
    label: 'selenium-webdriver'
  },
  {
    url:   'https://www.selenium.dev/documentation/webdriver/elements/',
    label: 'selenium-elements'
  },
  {
    url:   'https://www.selenium.dev/documentation/webdriver/waits/',
    label: 'selenium-waits'
  },
  {
    url:   'https://www.selenium.dev/documentation/webdriver/interactions/',
    label: 'selenium-interactions'
  },
  // ── Test Practices & Patterns ─────────────────────────────────
  {
    url:   'https://www.selenium.dev/documentation/test_practices/',
    label: 'selenium-practices'
  },
  // ── TestNG ────────────────────────────────────────────────────
  {
    url:   'https://testng.org/doc/documentation-main.html',
    label: 'testng-docs'
  },
  // ── Selenium Grid ─────────────────────────────────────────────
  {
    url:   'https://www.selenium.dev/documentation/grid/',
    label: 'selenium-grid'
  }
];

module.exports = { SOURCES };
