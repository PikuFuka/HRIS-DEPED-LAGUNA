<!DOCTYPE html>
<html>
<head>
    <title>Personal Data Sheet</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        .header { text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid black; padding: 5px; text-align: left; }
        th { background-color: #f2f2f2; width: 30%; }
    </style>
</head>
<body>
    <div class="header">
        CS FORM 212 (Revised 2017)<br>
        PERSONAL DATA SHEET
    </div>

    <table>
        <tr>
            <th>Employee ID</th>
            <td>{{ $employee->employee_id }}</td>
        </tr>
        <tr>
            <th>Last Name</th>
            <td>{{ $employee->last_name }}</td>
        </tr>
        <tr>
            <th>First Name</th>
            <td>{{ $employee->first_name }}</td>
        </tr>
        <tr>
            <th>Middle Name</th>
            <td>{{ $employee->middle_name ?? 'N/A' }}</td>
        </tr>
        <tr>
            <th>Suffix</th>
            <td>{{ $employee->suffix ?? 'N/A' }}</td>
        </tr>
        <tr>
            <th>Sex</th>
            <td>{{ ucfirst($employee->sex->value) }}</td>
        </tr>
        <tr>
            <th>Date of Birth</th>
            <td>{{ $employee->dob->format('F d, Y') }}</td>
        </tr>
        <tr>
            <th>Employment Type</th>
            <td>{{ ucfirst($employee->employment_type->value) }}</td>
        </tr>
        <tr>
            <th>GSIS</th>
            <td>{{ $employee->gsis ?? 'N/A' }}</td>
        </tr>
        <tr>
            <th>TIN</th>
            <td>{{ $employee->tin ?? 'N/A' }}</td>
        </tr>
        <tr>
            <th>Civil Service Eligibility</th>
            <td>{{ $employee->civil_service_eligibility ?? 'N/A' }}</td>
        </tr>
    </table>

    <p>This is a system-generated document based on the HRIS database records.</p>
</body>
</html>
