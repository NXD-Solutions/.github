# Network Tests — NXD Platform Architecture

---

## Test: View employee data

**User story:** As a manager I have the responsibility for my employees data
therefore I need to view my employees data from time to time

**Expected nodes:**
- ViewEmployeeData : Trigger — carries managerId, routes to FetchEmployeeData
- FetchEmployeeData : Process — declares EmployeeFetch and EmployeeHandover adapters
- EmployeeFetch : DataFetchAdapter — receives managerId, returns employee records
- EmployeeHandover : HandoverAdapter — receives employee records, returns to caller

**Validation:**
1. Every Process declares exactly one Trigger ✓ ViewEmployeeData
2. Every Process declares exactly one FetchAdapter ✓ EmployeeFetch
3. Every Process declares exactly one HandoverAdapter ✓ EmployeeHandover
4. Every adapter referenced exists as a node ✓ both declared
5. Every Trigger references an existing Process ✓ FetchEmployeeData exists
