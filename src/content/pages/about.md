---
template: about-page
slug: /about
title: Spreadsheets
---
Don't we all love spreadsheets? I mean who hasn't woken up and thought you know what I want to do with my day today? Stare at a spreadsheet copying, deleting records and cmd + f ing till my fingers go numb. \
\
Well thats the problem Victoria was having with her Spreadsheet when she entrusted me and my collaborator Kelvin Saldana with creating a tool that that could replace her current asset management spreadsheet. This spreadsheet had over 12 tabs of historical, currently checked out and defunct laptops records that Victoria uses to manage over 150 laptops for Pursuit's rotating cohorts and staff.

![spreadsheet](/assets/screenshot-2026-03-30-at-5.20.40 pm.png "Spreadsheet")

## User Requirements

### Must

* Victoria must be able to use our tool or the spreadsheet she is comfortable with. As a power user she is able to use her spreadsheet tool effectively and our tool should synchronize with the spreadsheet until she is ready to completely switch.
* Our tool must be understandable at a glance so that steff and other staff members do not how to ask Victoria how to check out and return laptops.
* Our tool must handle all laptop simpleMDM tasks victoria does on a regular basis. (clearing, locking, setting a pin). so that she does not have to navigate between this tool and simple MDM.

### Could

* Track the status of Victoria's communications with students about overdue equipment. Tracking number and times of reach outs and id needed lock date.
* Automate initial reach outs and notify if student sends a response.

## Tech Stack

* Fly.io hosting provider. chosen for its generous free tier and support for sqlite.
* Sqlite chosen as a light weight database.
* Google sheets API with service account used to autoupdate and check status of google sheets.

## Our Solution

![Website with multiple columns and filters](/assets/screenshot-2026-03-30-at-5.52.16 pm.png "Our solution")

## **The Research**

![](/assets/screenshot-2026-03-31-at-1.11.10 pm.png)

### **Categories**

When initialy converting the spreadsheet into our backend database we found the categories column especially challenging. We found that as victoria had grown the spreadsheet she had to take multiple factors into account. She needed a way to track if a laptop was ready to assign, assigned, or returned. but she also needed to know if a laptop was being leased or purchased when prioritizing which laptops should be assigned to make sure pursuit wouldnt end up paying twice if they had to pay to replace a laptop they were leasing.

The categories, assigned to and return date columns denoted these different statuses but required the user to apply a formula to understand which status a laptop was currently in by checking the 3 columns.

![table showing The categories, assigned to and return date columns are unclear in which status laptop status is denoted.](/assets/screenshot-2026-03-31-at-1.11.10 pm.png "table 1")

Currently 3 fields: categories, assigned to, returned must be used in tandem to determine a laptop’s status. This is daunting for Victoria’s colleagues who occasionally use her spreadsheet and just need to know if they can assign a laptop and which to prioritize assigning.

Below are 5 common examples of different variations of these fields and what ownership and status they map to in our new database design

![diagram showing 3 column input and expected ownership and status output.](/assets/screenshot-2026-03-31-at-3.48.31 pm.png "diagram 2 detailing status and ownership rules")

![Website with ownership and status columns clearly displaying 2 most important fields for assigning laptops.](/assets/screenshot-2026-03-31-at-3.53.23 pm.png "screenshot of our solution")


As you can see above our solution clearly displays ownership and status, the 2 most important fields for assigning laptops.
