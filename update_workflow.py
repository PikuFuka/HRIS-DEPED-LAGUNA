import re

file_path = 'client/src/pages/workflow/WorkflowView.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace length: 15 with length: 13
content = content.replace('Array.from({ length: 15 })', 'Array.from({ length: 13 })')

# Replace currentStep < 15 with currentStep < 13
content = content.replace('currentStep < 15', 'currentStep < 13')

# We need to shift the steps in StepContent.
# Currently, step 3 is Applicant, step 4 is Records, step 5 is ADAS, etc.
# New step 3 should encompass both Applicant and Records.
# For simplicity, let's just decrement steps 5 to 14 by 1.
# Step 5 -> 4
# Step 6 -> 5
# Step 7 -> 6
# Step 8 -> 7
# Step 9 -> 8
# Step 10 -> 9
# Step 11 -> 10
# Step 12 -> 11
# Step 13 -> 12
# Step 14 -> 13
# Step 15 -> remove
# Step 16 -> remove

# First, remove steps 15 and 16
content = re.sub(r'  if \(step === 15\) \{.*?(?=  if \(step === 16\))', '', content, flags=re.DOTALL)
content = re.sub(r'  if \(step === 16\) \{.*?(?=^}$)', '', content, flags=re.DOTALL | re.MULTILINE)

# Now decrement steps 5 to 14
for i in range(14, 4, -1):
    content = content.replace(f'if (step === {i}) {{', f'if (step === {i - 1}) {{')
    content = content.replace(f'activeStep === {i};', f'activeStep === {i - 1};')

# Now what about step 4 (Records)? It should become step 3. But step 3 is already Applicant.
# We can rename old step 3 to step 3 (Applicant), and old step 4 to step 3 (Records).
# But we can't have two `if (step === 3) {` blocks that both return! The first one will always trigger.
# Let's combine them:
# `if (step === 3) { if (role === 'applicant') { ... return applicant UI } else { ... return records UI } }`

# To do this safely, let's manually extract old step 3 and old step 4 and combine them.
# Alternatively, since Records can view the applicant's uploads anyway, maybe `role === "records"` can just see the records UI, and `role === "applicant"` can see the upload UI.
# Let's modify old step 4 to be step 3, but add a condition: `if (step === 3 && role !== 'applicant')`
# And modify old step 3 to be `if (step === 3 && role === 'applicant')`

content = content.replace('if (step === 3) {', 'if (step === 3 && role === "applicant") {')
content = content.replace('if (step === 4) {', 'if (step === 3 && role !== "applicant") {')
content = content.replace('activeStep === 4;', 'activeStep === 3;')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Update complete.")
