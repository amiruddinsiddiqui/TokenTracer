# Automated Tests

## Test File

### tests/audit.service.test.js

Covers:
- Cursor Business → Pro recommendation logic
- ChatGPT → Cursor replacement logic for coding workflows
- Total monthly savings calculation
- Annual savings generation
- Recommendation array generation
- Mocked AI summary generation to avoid external Gemini API calls during testing

## Run Tests

```bash
npm test