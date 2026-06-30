# Quiz

Interactive MCQ quizzes for all 13 topics + 5 final mixed quizzes. Built with plain HTML + JavaScript — no server required.

## [👉 Open the Quiz Hub](https://ijk37.github.io/linux-administration/03-quiz/)

**Locally:** Open `index.html` in your browser.

---

## Topic Quizzes — 20 questions each

| # | Topic | Questions |
|---|-------|-----------|
| 01 | Introduction to Linux | 20 |
| 02 | File System & Navigation | 20 |
| 03 | Users & Groups | 20 |
| 04 | File Permissions | 20 |
| 05 | Package Management | 20 |
| 06 | Process Management | 20 |
| 07 | Networking | 20 |
| 08-01 | Shell Scripting: Basics | 20 |
| 08-02 | Shell Scripting: Conditionals | 20 |
| 08-03 | Shell Scripting: Loops | 20 |
| 08-04 | Shell Scripting: Functions | 20 |
| 09 | System Monitoring & Logs | 20 |
| 10 | SSH & Remote Access | 20 |

## Final Mixed Quizzes — 50 questions each

| Quiz | Focus | Questions |
|------|-------|-----------|
| Mixed 1 | Heavy on early topics (01–07) | 50 |
| Mixed 2 | Moderate lean toward early topics | 50 |
| Mixed 3 | Balanced across all topics | 50 |
| Mixed 4 | Moderate lean toward later topics | 50 |
| Mixed 5 | Heavy on later topics (08–10) | 50 |

---

## Features

- Questions shuffle on every attempt
- Instant feedback — correct/wrong highlighted after each answer
- Explanation shown after every answer
- Score and grade at the end
- Review of all wrong answers with correct answers and explanations
- Retry button re-shuffles questions

## Files

| File | Purpose |
|------|---------|
| `index.html` | Quiz hub — topic selector |
| `quiz.html` | Quiz engine |
| `data.js` | Base questions (10 per topic quiz, 15 per mixed quiz) |
| `data-extra.js` | +10 per topic quiz, +5 per mixed quiz |
| `data-mixed.js` | +30 per mixed quiz (brings mixed total to 50) |

---

[← Back to Root](../README.md)
