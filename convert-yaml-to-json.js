#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Convert a YAML file to JSON format
 * @param {string} yamlFilePath - Path to the YAML file
 * @param {string} jsonFilePath - Path where JSON file should be saved
 */
function convertYamlToJson(yamlFilePath, jsonFilePath) {
  try {
    console.log(`Converting ${yamlFilePath} to ${jsonFilePath}...`);
    
    // Read YAML file
    const yamlContent = fs.readFileSync(yamlFilePath, 'utf8');
    
    // Parse YAML - handle multiple documents
    const documents = yaml.loadAll(yamlContent);
    
    // Prepare JSON content
    let jsonContent;
    if (documents.length === 1) {
      // Single document - save as single object
      jsonContent = documents[0];
    } else {
      // Multiple documents - save as array
      jsonContent = documents;
    }
    
    // Ensure output directory exists
    const outputDir = path.dirname(jsonFilePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write JSON file with proper formatting
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonContent, null, 2));
    
    console.log(`✅ Successfully converted ${yamlFilePath} to ${jsonFilePath}`);
    
  } catch (error) {
    console.error(`❌ Error converting ${yamlFilePath}:`, error.message);
    process.exit(1);
  }
}

/**
 * Main function to convert all YAML files
 */
function main() {
  console.log('🚀 Starting YAML to JSON conversion using JavaScript...\n');
  
  // Define file mappings: [yamlPath, jsonPath]
  const conversions = [
    ['argocd-manifests/namespace.yaml', 'argocd-manifests-json/namespace.json'],
    ['argocd-manifests/appproject.yaml', 'argocd-manifests-json/appproject.json'],
    ['argocd-manifests/application.yaml', 'argocd-manifests-json/application.json'],
    ['k8s-manifests/deployment.yaml', 'k8s-manifests-json/deployment.json']
  ];
  
  let successCount = 0;
  let totalCount = conversions.length;
  
  // Process each conversion
  conversions.forEach(([yamlPath, jsonPath]) => {
    if (fs.existsSync(yamlPath)) {
      convertYamlToJson(yamlPath, jsonPath);
      successCount++;
    } else {
      console.log(`⚠️  Warning: ${yamlPath} not found, skipping...`);
    }
  });
  
  console.log(`\n🎉 Conversion complete! ${successCount}/${totalCount} files converted successfully.`);
  
  // List all generated JSON files
  console.log('\n📁 Generated JSON files:');
  conversions.forEach(([yamlPath, jsonPath]) => {
    if (fs.existsSync(jsonPath)) {
      const stats = fs.statSync(jsonPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`   ✓ ${jsonPath} (${sizeKB} KB)`);
    }
  });
  
  console.log('\n✨ All YAML files have been converted to JSON using JavaScript!');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { convertYamlToJson };