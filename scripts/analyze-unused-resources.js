const fs = require('fs');

// Path to the report.json file
const reportPath = './report.json';

// Function to analyze unused JavaScript and CSS
function analyzeUnusedResources() {
  if (!fs.existsSync(reportPath)) {
    console.error('Error: report.json file not found.');
    return;
  }

  const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

  // Extract unused JavaScript and CSS data from the audits section
  const unusedJsAudit = reportData.audits['unused-javascript'];
  const unusedCssAudit = reportData.audits['unused-css-rules'];

  console.warn('--- Unused JavaScript Summary ---');
  if (unusedJsAudit && unusedJsAudit.details && unusedJsAudit.details.items) {
    unusedJsAudit.details.items.forEach((item, index) => {
      console.warn(`${index + 1}. URL: ${item.url || 'N/A'}`);
      console.warn(`   Wasted Bytes: ${item.wastedBytes || 0}`);
    });
  } else {
    console.warn('No unused JavaScript detected.');
  }

  console.warn('\n--- Unused CSS Summary ---');
  if (unusedCssAudit && unusedCssAudit.details && unusedCssAudit.details.items) {
    unusedCssAudit.details.items.forEach((item, index) => {
      console.warn(`${index + 1}. URL: ${item.url || 'N/A'}`);
      console.warn(`   Wasted Bytes: ${item.wastedBytes || 0}`);
    });
  } else {
    console.warn('No unused CSS detected.');
  }
}

// Run the analysis
analyzeUnusedResources();
