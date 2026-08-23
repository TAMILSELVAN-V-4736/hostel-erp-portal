For a production-grade result, I’d use **one unified design system** with clearly different experiences for **Student** and **Admin**, rather than making two unrelated applications.

You can use the following as a master prompt for an AI UI generator/design tool:

# Hostel ERP — Production-Grade UI/UX Design Prompt

Design and build a **professional, production-grade Hostel ERP web application** for colleges and universities.

The application must feel like a real-world enterprise product used by a large educational institution — **not a student project, not a generic dashboard template, and not a grievance-management website**.

The system is a complete **Hostel Enterprise Resource Planning (ERP)** platform covering student management, hostel/room management, leave, mess, fees, maintenance, grievances, visitors, notices, notifications, reports, and administration.

The UI must be **role-based**, with distinct experiences for:

1. **Student**
2. **Admin**

The architecture should be designed so additional roles such as Warden, Maintenance Staff, Mess Staff, and Security Staff can be introduced later.

---

# 1. Overall Design Direction

Create a modern enterprise SaaS-style interface inspired by high-quality products such as modern education platforms, banking dashboards, enterprise administration systems, and premium SaaS applications.

The visual language should communicate:

* Trust
* Reliability
* Professionalism
* Clarity
* Efficiency
* Institutional credibility
* Modern technology

Avoid:

* Overly colorful student-project aesthetics
* Excessive gradients
* Huge decorative illustrations
* Excessive rounded cards
* Cartoon-style icons
* Glassmorphism everywhere
* Excessive animations
* Cluttered dashboards
* Generic Bootstrap-looking layouts

Use a restrained, sophisticated visual system.

---

# 2. Visual Style

Use:

* Clean white/light-gray surfaces
* Deep navy or charcoal primary color
* One strong institutional accent color
* Subtle borders
* Soft shadows
* Medium corner radius
* Excellent spacing
* Strong typography hierarchy
* Dense but readable enterprise tables
* Clear status indicators
* Consistent iconography

Suggested palette:

```text
Primary:
#172554 / #1E3A8A

Accent:
#2563EB

Success:
#16A34A

Warning:
#D97706

Danger:
#DC2626

Background:
#F8FAFC

Surface:
#FFFFFF

Border:
#E2E8F0

Primary Text:
#0F172A

Secondary Text:
#64748B
```

Do not force these exact colors if a better cohesive palette is available.

---

# 3. Typography

Use a highly readable modern sans-serif typeface such as:

* Inter
* Geist
* Plus Jakarta Sans

Use clear hierarchy:

```text
Page title
Section title
Card title
Body
Secondary information
Metadata
```

Avoid excessively large headings.

The product should feel information-dense but comfortable.

---

# 4. Global Application Shell

Both roles should share a common application shell.

Desktop:

```text
┌──────────────────────────────────────────────────────────────┐
│ Logo / Hostel ERP       Search       Notifications   Profile │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│ Sidebar       │                Main Content                  │
│               │                                              │
│ Dashboard     │                                              │
│               │                                              │
│ Module 1      │                                              │
│ Module 2      │                                              │
│ Module 3      │                                              │
│               │                                              │
│               │                                              │
│ Settings      │                                              │
│ Help          │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

The sidebar should support:

* Collapsed mode
* Expanded mode
* Active state
* Nested navigation
* Role-based menu visibility

The top bar should contain:

* Global search
* Notifications
* Help
* Profile menu
* Current role/context where appropriate

---

# 5. Student UI

The student experience should feel **personal, simple, and service-oriented**.

Students should not see administrative complexity.

Student navigation:

```text
Dashboard

My Profile

My Hostel
  ├── Room Details
  ├── Roommates
  └── Hostel Information

Leave & Outing

Mess
  ├── Today's Menu
  ├── Weekly Menu
  └── Feedback

Requests
  ├── Maintenance
  └── Grievances

Fees & Payments

Notices

Visitors

Feedback

Notifications
```

Only modules relevant to the student's own data should appear.

---

# 6. Student Dashboard

Create a polished student dashboard.

Header:

```text
Good Morning, Arjun
Here's your hostel overview.
```

Show:

### Quick information

* Hostel
* Block
* Room
* Bed
* Current occupancy

### Summary cards

```text
Pending Requests
2

Leave Requests
1

Outstanding Fees
₹4,500

Unread Notices
3
```

Use compact, elegant cards.

---

# 7. Student Dashboard Sections

### Today's Information

Show:

* Today's mess menu
* Hostel announcements
* Important notifications

### My Requests

Display recent:

* Maintenance requests
* Grievances
* Leave applications

Each should show:

* Request ID
* Category
* Date
* Status
* Last update

### Upcoming

Show:

* Approved leave
* Important deadlines
* Events
* Fee due dates

---

# 8. Student Room Page

Create a visual room information page.

Show:

```text
Hostel: Boys Hostel
Block: B
Floor: 2
Room: B-204
Bed: B-204-03
```

Include a visual representation:

```text
Room B-204

┌─────────┬─────────┐
│ Bed 01  │ Bed 02  │
│ Rahul   │ Arjun   │
├─────────┼─────────┤
│ Bed 03  │ Bed 04  │
│ You     │ Empty   │
└─────────┴─────────┘
```

Show roommates and room facilities.

---

# 9. Student Leave Page

Provide a clean application interface.

Fields:

* Leave type
* Start date
* End date
* Destination
* Reason
* Emergency contact if required
* Supporting document if applicable

Show workflow status visually:

```text
Submitted → Under Review → Approved → Completed
```

Use a timeline rather than a simple text status.

Include:

* Pending applications
* Approved applications
* Rejected applications
* Leave history

---

# 10. Student Maintenance Page

Create a request-management interface.

Primary CTA:

**+ Report an Issue**

Categories:

* Electrical
* Plumbing
* Furniture
* Water
* Cleaning
* Wi-Fi
* Room
* Other

Request cards/table should show:

```text
MT-1024
Water Leakage
Room B-204

In Progress
Assigned to Maintenance

Updated 2 hours ago
```

Include request details page with:

* Description
* Attachments
* Timeline
* Assigned staff
* Comments
* Status
* Resolution

---

# 11. Student Grievance Page

Grievance should be **one module among many**, not the visual focus of the application.

Create a professional interface.

Primary CTA:

**Submit Grievance**

Categories:

* Hostel Facilities
* Food
* Room
* Security
* Staff
* Cleanliness
* Rules
* Other

Show:

```text
GRV-1028
Hostel Water Supply

Under Review

Submitted
15 Aug 2026

Last updated
Today, 10:42 AM
```

Details page should have a professional timeline:

```text
Submitted
      ↓
Under Review
      ↓
Assigned
      ↓
In Progress
      ↓
Resolved
      ↓
Closed
```

Allow the student to:

* View updates
* Add information
* Upload evidence
* Confirm resolution
* Reopen if unresolved

---

# 12. Student Fees Page

Create a financial dashboard.

Show:

```text
Total Fee       Paid        Outstanding
₹48,000         ₹43,500     ₹4,500
```

Show:

* Fee breakdown
* Due dates
* Payment history
* Receipts
* Outstanding balance

Primary CTA:

**Pay Outstanding Amount**

Use a trustworthy banking-style design.

---

# 13. Student Mess Page

Show:

### Today's Menu

```text
Breakfast
Idli • Sambar • Chutney

Lunch
Rice • Dal • Vegetable • Curd

Dinner
Chapati • Paneer • Rice
```

Also show:

* Weekly menu
* Meal timings
* Special announcements
* Mess feedback

---

# 14. Student Notices

Create an institutional announcement center.

Each notice should have:

* Title
* Category
* Published date
* Priority
* Issuer
* Content

Use clear labels such as:

```text
IMPORTANT
GENERAL
MESS
MAINTENANCE
ACADEMIC
EMERGENCY
```

---

# 15. Student Profile

Create a polished profile page.

Sections:

### Personal Information

* Name
* Student ID
* Department
* Year
* Contact

### Guardian Information

* Parent/Guardian
* Contact
* Emergency contact

### Hostel Information

* Hostel
* Block
* Floor
* Room
* Bed

Allow editing only where appropriate.

---

# 16. Admin UI

The Admin Portal should feel significantly more powerful.

The admin should see the entire hostel ecosystem.

Admin navigation:

```text
Dashboard

Students
  ├── All Students
  ├── New Students
  └── Student Records

Hostels
  ├── Hostels
  ├── Blocks
  ├── Floors
  ├── Rooms
  └── Beds

Room Allocation

Staff
  ├── Wardens
  ├── Maintenance
  ├── Mess Staff
  └── Security

Leave Management

Maintenance

Grievances

Mess Management

Fees & Payments

Visitors

Notices

Notifications

Reports & Analytics

Audit Logs

Settings
```

Admin should have access to global search and advanced filtering.

---

# 17. Admin Dashboard

Create a sophisticated executive dashboard.

Header:

```text
Good Morning, Admin
Here's the current overview of hostel operations.
```

### KPI cards

```text
Total Students
2,486

Occupancy
92.8%

Pending Requests
42

Outstanding Fees
₹12.4L
```

Additional cards:

```text
Pending Leave
18

Open Maintenance
24

Active Grievances
11

Available Beds
176
```

---

# 18. Admin Analytics

Include professional charts.

### Occupancy

Line/bar chart:

```text
Hostel A    ████████████████ 94%
Hostel B    ███████████████  91%
Hostel C    █████████████    87%
```

### Grievances

Show:

* Open
* In Progress
* Resolved
* Escalated

### Maintenance

Show:

* New
* Assigned
* In Progress
* Completed

### Fees

Show:

* Collected
* Pending
* Overdue

Use charts sparingly and prioritize useful information.

---

# 19. Admin Student Management

Create a professional enterprise table.

Columns:

```text
Student ID
Name
Department
Year
Hostel
Room
Status
Actions
```

Features:

* Search
* Filters
* Sort
* Pagination
* Bulk actions
* Export
* Add student
* View student
* Edit student
* Deactivate student

Use a drawer or dedicated details page for student information.

---

# 20. Admin Room Management

Provide both:

### Table View

```text
Room     Capacity    Occupied    Available    Status
A-101       4           4            0         Full
A-102       4           3            1         Available
A-103       4           2            2         Available
```

### Visual View

Allow administrators to navigate:

```text
Hostel
 ↓
Block
 ↓
Floor
 ↓
Room
 ↓
Beds
```

Use visual occupancy indicators.

---

# 21. Admin Leave Management

Create a management dashboard.

Show:

* Pending approvals
* Approved
* Rejected
* Active leave
* Overdue returns

Provide filters:

* Hostel
* Block
* Date
* Leave type
* Status

Admin/warden should be able to approve or reject directly from the interface.

---

# 22. Admin Grievance Management

This is a powerful management interface.

Dashboard:

```text
Total
124

New
18

In Progress
32

Resolved
68

Escalated
6
```

Use a table:

```text
ID
Student
Category
Hostel
Priority
Assigned To
Status
Created
Actions
```

Allow:

* Assignment
* Reassignment
* Status updates
* Escalation
* Comments
* Attachments
* Resolution
* Audit history

Add filters for:

* Priority
* Hostel
* Category
* Status
* Assignee
* Date

---

# 23. Admin Maintenance Management

Use a similar operational interface.

Provide:

* Open requests
* Assigned requests
* In progress
* Completed
* Overdue

Allow administrators to assign tasks to staff.

Show staff workload:

```text
Maintenance Staff

Ravi
8 active tasks

Kumar
4 active tasks

Suresh
2 active tasks
```

---

# 24. Admin Mess Management

Provide:

* Menu management
* Weekly menu planner
* Meal schedules
* Feedback overview
* Food issue tracking
* Mess performance

Use a calendar/planner interface for menus.

---

# 25. Admin Fees

Create a finance-focused interface.

Show:

```text
Total Expected
₹1.24 Cr

Collected
₹1.11 Cr

Pending
₹13 L

Overdue
₹4.2 L
```

Provide:

* Fee structures
* Student dues
* Payment history
* Receipts
* Outstanding payments
* Date filters
* Hostel filters

---

# 26. Admin Reports

Create a dedicated reporting center.

Categories:

### Student Reports

* Student list
* Hostel-wise students
* Department-wise students
* Year-wise students

### Occupancy

* Hostel occupancy
* Room occupancy
* Available beds

### Operations

* Leave reports
* Maintenance reports
* Grievance reports
* Visitor reports

### Finance

* Fee collection
* Outstanding fees
* Payment history

### Mess

* Feedback
* Ratings
* Issues

Every report should support:

* Filters
* Date range
* Search
* Export
* Print

---

# 27. Admin Audit Logs

Create an enterprise-grade audit interface.

Example:

```text
15 Aug 2026 10:42

Admin changed room allocation

Student: STU1024
Previous: A-204
New: B-102

Performed by:
Admin User
```

Filters:

* User
* Action
* Module
* Date
* Entity

---

# 28. Role-Based UI Rules

The UI must dynamically change based on the authenticated user's role.

### Student

Show:

```text
Dashboard
My Profile
My Hostel
Leave
Mess
Maintenance
Grievances
Fees
Notices
Visitors
Feedback
Notifications
```

### Admin

Show:

```text
Dashboard
Students
Hostels
Rooms
Allocations
Staff
Leave
Maintenance
Grievances
Mess
Fees
Visitors
Notices
Reports
Audit Logs
Settings
```

Never simply show admin pages and disable buttons for students.

Unauthorized modules should **not appear in the navigation at all**.

---

# 29. Responsive Design

The application must be fully responsive.

### Desktop

Use:

* Persistent sidebar
* Wide tables
* Dashboard grids
* Multi-column layouts

### Tablet

Use:

* Collapsible sidebar
* Responsive tables
* Two-column cards

### Mobile

Student experience should be optimized for mobile.

Use:

```text
Bottom Navigation

Home
Requests
Leave
Notices
Profile
```

Admin should remain primarily desktop-oriented but still be usable on tablets/mobile.

---

# 30. Tables

Tables should feel like real enterprise tables.

Include:

* Sticky header
* Row hover
* Status badges
* Search
* Filters
* Pagination
* Column alignment
* Bulk selection
* Actions menu

Avoid excessively large rows.

---

# 31. Forms

Forms must be professional.

Use:

* Clear labels
* Helper text
* Required indicators
* Inline validation
* Error messages
* File upload areas
* Date pickers
* Dropdowns
* Searchable selects
* Confirmation dialogs

Don't put every field inside a single enormous form.

Group related information into logical sections.

---

# 32. Status System

Create a consistent status language across the entire application.

### Blue

Information / Under Review

### Yellow

Pending / Waiting

### Orange

Escalated / Attention Required

### Green

Approved / Completed / Resolved

### Red

Rejected / Failed / Critical

### Gray

Draft / Inactive / Archived

Use both **color + text/icon** so status isn't communicated by color alone.

---

# 33. Empty States

Every module needs thoughtful empty states.

Example:

```text
No pending leave requests

You're all caught up.
```

Avoid generic:

> "No data found."

Give users useful context and an action when appropriate.

---

# 34. Loading States

Use skeleton loading for:

* Dashboards
* Tables
* Cards
* Details pages

Avoid blank white screens.

---

# 35. Error States

Errors should be human-readable.

Instead of:

> Error 500

show:

> **Something went wrong**
>
> We couldn't load the student information.
> Please try again.

Provide a retry action.

---

# 36. Confirmation Dialogs

Use confirmation dialogs for destructive/high-impact actions:

* Delete
* Deactivate student
* Reject request
* Cancel allocation
* Remove room assignment
* Close grievance

Example:

```text
Deactivate Student?

This will prevent the student from accessing
the hostel portal.

[Cancel] [Deactivate Student]
```

---

# 37. Notifications UI

Create a notification center accessible from the top bar.

Group notifications:

```text
Today

Leave request approved
10:32 AM

Maintenance request updated
09:18 AM

Yesterday

New hostel notice
Yesterday, 6:42 PM
```

Use unread indicators.

---

# 38. Search

Implement a powerful global search.

Admin should be able to search:

```text
Student
Room
Grievance
Maintenance Request
Payment
Staff
Notice
```

Example:

```text
Search "STU1024"

Students
STU1024 — Arjun Kumar

Room
B-204

Grievances
GRV-1028
```

---

# 39. Accessibility

The UI must be accessible.

Include:

* Keyboard navigation
* Proper focus states
* Accessible labels
* Sufficient color contrast
* Screen-reader-friendly controls
* Non-color-only status indicators
* Appropriate touch target sizes

---

# 40. Motion

Use subtle motion only.

Examples:

* Sidebar transitions
* Modal appearance
* Toast notifications
* Dropdown animations
* Page transitions

Avoid:

* Constant floating animations
* Excessive parallax
* Decorative motion
* Slow page transitions

The application should feel **fast**.

---

# 41. Overall UX Principle

The system should follow this hierarchy:

```text
Student
→ Simple
→ Personal
→ Service-oriented

Warden/Staff
→ Operational
→ Task-oriented
→ Workflow-focused

Admin
→ Data-rich
→ Analytical
→ Control-oriented
```

Do not give every role the same dashboard.

---

# 42. Final Product Feel

The finished UI should feel like a **serious institutional ERP product** that a university could actually deploy.

It should combine:

* Modern SaaS aesthetics
* Enterprise data tables
* Clean dashboards
* Strong information hierarchy
* Role-based navigation
* Workflow-driven interfaces
* Professional forms
* Consistent design system
* Responsive layouts
* Accessible interactions
* Clear status and approval flows

The final application should look **premium, restrained, modern, trustworthy, and production-ready** — not flashy.

Build the UI around the principle:

> **"Everything a student needs in one place. Everything an administrator needs to run the hostel in one control center."**
