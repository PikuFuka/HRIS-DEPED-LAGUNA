file_path = 'client/src/pages/workflow/WorkflowView.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

parts = content.split('if (step === 3 && role !== "applicant") {')

if len(parts) == 12:
    new_content = parts[0]
    new_content += 'if (step === 3 && role !== "applicant") {'
    new_content += parts[1]

    for i in range(2, len(parts)):
        step_num = i + 2 # i=2 -> 4, i=11 -> 13
        new_content += f'if (step === {step_num}) {{'
        part = parts[i].replace('activeStep === 3;', f'activeStep === {step_num};')
        new_content += part

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Fixed WorkflowView.tsx")
else:
    print(f"Error: expected 12 parts, found {len(parts)}")
