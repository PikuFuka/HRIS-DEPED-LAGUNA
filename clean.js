const fs = require('fs');

let content = fs.readFileSync('client/src/pages/workflow/WorkflowView.tsx', 'utf8');

// Replace Mary Jane Smith with applicant Name
content = content.replace(/Mary Jane Smith/g, '{application.applicantName || "Applicant"}');

// Replace mock score values
content = content.replace(/85 pts/g, '-- pts');
content = content.replace(/41 pts/g, '-- pts');
content = content.replace(/92 pts/g, '-- pts');
content = content.replace(/218/g, '---');

// Replace <DocCard ... /> lines
// Instead of replacing the whole block, just replace the tag itself
const docCardRegex = /<DocCard\s+title="[^"]+"\s+date="[^"]+"\s*\/>/g;
const docCardReplacement = `{/* Removed mock DocCard */}`;
content = content.replace(docCardRegex, docCardReplacement);

// Replace multi-line DocCard
const multiDocCardRegex = /<DocCard\s+title="[^"]+"\s+date="[^"]+"\s+onRemove=\{[\s\S]*?\}\s*\/>/g;
content = content.replace(multiDocCardRegex, docCardReplacement);

// Just simple replacement for remaining DocCards
const anyDocCardRegex = /<DocCard[\s\S]*?\/>/g;
content = content.replace(anyDocCardRegex, docCardReplacement);

fs.writeFileSync('client/src/pages/workflow/WorkflowView.tsx', content);
console.log("Successfully cleaned up WorkflowView.tsx");
