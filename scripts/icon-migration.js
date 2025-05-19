/**
 * Icon Migration Script
 *
 * This script helps identify all icon usages in the codebase to assist with migration
 * to the centralized icon system.
 *
 * Usage:
 * node scripts/icon-migration.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const rootDir = path.resolve(__dirname, '..');
const extensions = ['.tsx', '.jsx', '.ts', '.js'];
const iconLibraries = ['lucide-react', 'react-icons'];
const ignoreDirs = ['node_modules', '.next', 'out', 'build', 'dist'];

// Regular expressions for finding icon imports and usages
const importRegex = /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g;
const iconUsageRegex = /<([A-Z][a-zA-Z0-9]*)(?:\s+[^>]*)?\/>/g;
const iconPropsRegex = /<([A-Z][a-zA-Z0-9]*)\s+([^>]*)\/>/g;

// Results storage
const results = {
  files: 0,
  iconImports: [],
  iconUsages: [],
  summary: {
    totalFiles: 0,
    filesWithIcons: 0,
    totalIconImports: 0,
    totalIconUsages: 0,
    iconsByLibrary: {},
    topIcons: [],
  },
};

// Find all files to scan
function findFiles() {
  const pattern = `${rootDir}/**/*{${extensions.join(',')}}`;
  const ignorePattern = ignoreDirs.map((dir) => `${rootDir}/${dir}/**`);

  return glob.sync(pattern, { ignore: ignorePattern });
}

// Parse a file for icon imports and usages
function parseFile(filePath) {
  const relativePath = path.relative(rootDir, filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const fileResult = {
    path: relativePath,
    imports: [],
    usages: [],
  };

  // Find icon imports
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const [, importNames, importPath] = match;

    if (iconLibraries.some((lib) => importPath.includes(lib))) {
      const icons = importNames
        .split(',')
        .map((name) => name.trim())
        .filter((name) => name && name.charAt(0) === name.charAt(0).toUpperCase());

      if (icons.length > 0) {
        fileResult.imports.push({
          library: importPath,
          icons,
          line: content.substring(0, match.index).split('\n').length,
        });
      }
    }
  }

  // Find icon usages
  const iconNames = new Set();
  fileResult.imports.forEach((imp) => imp.icons.forEach((icon) => iconNames.add(icon)));

  if (iconNames.size > 0) {
    // Create a regex pattern for all imported icons
    const iconPattern = Array.from(iconNames).join('|');
    const iconRegex = new RegExp(`<(${iconPattern})(?:\\s+[^>]*)?\\/>`, 'g');

    while ((match = iconRegex.exec(content)) !== null) {
      const [fullMatch, iconName] = match;
      const line = content.substring(0, match.index).split('\n').length;

      // Extract props if any
      let props = {};
      const propsMatch = fullMatch.match(/<[A-Z][a-zA-Z0-9]*\s+([^>]*)\/>/);
      if (propsMatch && propsMatch[1]) {
        const propsStr = propsMatch[1];
        // Extract size prop
        const sizeMatch = propsStr.match(/size=\{([^}]+)\}/);
        if (sizeMatch) props.size = sizeMatch[1];

        // Extract className prop
        const classNameMatch = propsStr.match(/className=["']([^"']+)["']/);
        if (classNameMatch) props.className = classNameMatch[1];
      }

      fileResult.usages.push({
        icon: iconName,
        line,
        props,
      });
    }
  }

  return fileResult;
}

// Update summary statistics
function updateSummary(fileResult) {
  results.summary.totalFiles++;

  if (fileResult.imports.length > 0 || fileResult.usages.length > 0) {
    results.summary.filesWithIcons++;
  }

  fileResult.imports.forEach((imp) => {
    results.summary.totalIconImports += imp.icons.length;

    const library = imp.library;
    if (!results.summary.iconsByLibrary[library]) {
      results.summary.iconsByLibrary[library] = {
        count: 0,
        icons: {},
      };
    }

    imp.icons.forEach((icon) => {
      results.summary.iconsByLibrary[library].count++;

      if (!results.summary.iconsByLibrary[library].icons[icon]) {
        results.summary.iconsByLibrary[library].icons[icon] = 0;
      }
      results.summary.iconsByLibrary[library].icons[icon]++;
    });
  });

  results.summary.totalIconUsages += fileResult.usages.length;
}

// Generate a report of the findings
function generateReport() {
  // Calculate top icons
  const allIcons = {};
  Object.keys(results.summary.iconsByLibrary).forEach((library) => {
    const icons = results.summary.iconsByLibrary[library].icons;
    Object.keys(icons).forEach((icon) => {
      if (!allIcons[icon]) allIcons[icon] = 0;
      allIcons[icon] += icons[icon];
    });
  });

  results.summary.topIcons = Object.entries(allIcons)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([icon, count]) => ({ icon, count }));

  // Generate the report
  const report = {
    summary: results.summary,
    files: results.iconImports.map((file) => ({
      path: file.path,
      imports: file.imports,
      usages: file.usages,
    })),
  };

  return report;
}

// Generate migration suggestions
function generateMigrationSuggestions(report) {
  const suggestions = [];

  report.files.forEach((file) => {
    file.usages.forEach((usage) => {
      const iconName = usage.icon;
      const props = usage.props;

      let size = 'md';
      if (props.size) {
        // Try to map the size to our standard sizes
        const sizeValue = parseInt(props.size, 10);
        if (!isNaN(sizeValue)) {
          if (sizeValue <= 16) size = 'xs';
          else if (sizeValue <= 20) size = 'sm';
          else if (sizeValue <= 24) size = 'md';
          else if (sizeValue <= 32) size = 'lg';
          else size = 'xl';
        }
      }

      let variant = 'default';
      if (props.className) {
        // Try to determine variant from className
        if (props.className.includes('primary')) variant = 'primary';
        else if (props.className.includes('secondary')) variant = 'secondary';
        else if (props.className.includes('destructive') || props.className.includes('red'))
          variant = 'destructive';
        else if (props.className.includes('muted')) variant = 'muted';
        else if (props.className.includes('accent')) variant = 'accent';
        else if (props.className.includes('success') || props.className.includes('green'))
          variant = 'success';
        else if (
          props.className.includes('warning') ||
          props.className.includes('amber') ||
          props.className.includes('yellow')
        )
          variant = 'warning';
        else if (props.className.includes('info') || props.className.includes('blue'))
          variant = 'info';
      }

      suggestions.push({
        file: file.path,
        line: usage.line,
        original: `<${iconName} ${props.size ? `size={${props.size}}` : ''} ${props.className ? `className="${props.className}"` : ''} />`,
        suggested: `<Icon name="${iconName}" ${size !== 'md' ? `size="${size}"` : ''} ${variant !== 'default' ? `variant="${variant}"` : ''} />`,
      });
    });
  });

  return suggestions;
}

// Main function
async function main() {
  console.warn('🔍 Scanning codebase for icon usages...');

  const files = findFiles();
  console.warn(`Found ${files.length} files to scan.`);

  let fileCount = 0;
  for (const file of files) {
    fileCount++;
    if (fileCount % 100 === 0) {
      console.warn(`Processed ${fileCount} files...`);
    }

    const fileResult = parseFile(file);

    if (fileResult.imports.length > 0 || fileResult.usages.length > 0) {
      results.iconImports.push(fileResult);
      updateSummary(fileResult);
    }

    results.files++;
  }

  const report = generateReport();
  const suggestions = generateMigrationSuggestions(report);

  // Output summary
  console.warn('\n📊 Summary:');
  console.warn(`Total files scanned: ${report.summary.totalFiles}`);
  console.warn(`Files with icons: ${report.summary.filesWithIcons}`);
  console.warn(`Total icon imports: ${report.summary.totalIconImports}`);
  console.warn(`Total icon usages: ${report.summary.totalIconUsages}`);

  console.warn('\n📚 Icons by library:');
  Object.keys(report.summary.iconsByLibrary).forEach((library) => {
    console.warn(`  ${library}: ${report.summary.iconsByLibrary[library].count} imports`);
  });

  console.warn('\n🔝 Top 10 most used icons:');
  report.summary.topIcons.slice(0, 10).forEach((icon, index) => {
    console.warn(`  ${index + 1}. ${icon.icon}: ${icon.count} usages`);
  });

  console.warn('\n🔄 Migration suggestions (sample):');
  suggestions.slice(0, 5).forEach((suggestion) => {
    console.warn(`  File: ${suggestion.file} (line ${suggestion.line})`);
    console.warn(`    From: ${suggestion.original}`);
    console.warn(`    To:   ${suggestion.suggested}`);
    console.warn('');
  });

  // Save the report and suggestions to files
  const reportPath = path.join(rootDir, 'icon-migration-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.warn(`\n💾 Full report saved to: ${reportPath}`);

  const suggestionsPath = path.join(rootDir, 'icon-migration-suggestions.json');
  fs.writeFileSync(suggestionsPath, JSON.stringify(suggestions, null, 2));
  console.warn(`💾 Migration suggestions saved to: ${suggestionsPath}`);

  console.warn('\n✅ Done!');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
